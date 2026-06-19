import { processPayment } from '$lib/server/services/checkoutService.js';
import { getCartItems } from '$lib/server/services/cartService.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';

const paymentFormSchema = z.object({
	cartItemsJson: z.string().min(1, 'Cart items cannot be empty'),
	total: z.coerce.number().positive(),
	shippingAddress: z.string().min(1, 'Shipping address is required'),
	shippingPrice: z.coerce.number().min(0),
	shippingMethod: z.string().min(1, 'Shipping method is required'),
	paymentMethod: z.string().optional()
});

export const load = async ({ locals }: any) => {
	if (!locals.user) {
		throw redirect(303, '/client/auth');
	}

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = cartItemsRaw as unknown as {
		price: number;
		quantity: number;
		title?: string;
		image?: string;
	}[];

	const paymentForm = await superValidate(zod(paymentFormSchema));

	return { paymentForm, cartItems };
};

export const actions = {
	default: async ({ request, locals }: any) => {
		if (!locals.user) {
			return fail(401, { error: STRINGS.COMMON.UNAUTHORIZED });
		}

		const paymentForm = await superValidate(request, zod(paymentFormSchema));
		if (!paymentForm.valid) return fail(422, { paymentForm });

		const { cartItemsJson, total, shippingAddress, shippingPrice, shippingMethod } =
			paymentForm.data;

		try {
			const cartItems = JSON.parse(cartItemsJson as string);

			const result = await processPayment(
				locals.user.id,
				cartItems,
				total as number,
				shippingAddress as string,
				shippingPrice as number,
				shippingMethod as string
			);

			return message(paymentForm, STRINGS.CHECKOUT.MESSAGES.PAYMENT_SUCCESS);
		} catch (error: any) {
			logger.error('Payment processing error:', error);
			return message(paymentForm, error.message || STRINGS.CHECKOUT.MESSAGES.PAYMENT_FAILED, {
				status: 500
			});
		}
	}
};
