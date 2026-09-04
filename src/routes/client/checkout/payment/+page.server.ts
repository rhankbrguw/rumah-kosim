import { processPayment } from '$lib/server/services/checkoutService.js';
import { getCartItems } from '$lib/server/services/cartService.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';

import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';
import type { RequestEvent } from '@sveltejs/kit';
import type { CartItem } from '$lib/types';
import { MESSAGES } from '$lib/constants/messages.js';
import { ConflictException } from '$lib/server/utils/exceptions.js';

const paymentFormSchema = z.object({
	cartItemsJson: z.string().min(1, MESSAGES.VALIDATION.CART_ITEMS_REQUIRED),
	total: z.coerce.number().positive(MESSAGES.VALIDATION.TOTAL_POSITIVE),
	shippingAddress: z.string().min(1, MESSAGES.VALIDATION.SHIPPING_ADDRESS_REQUIRED),
	shippingPrice: z.coerce.number().min(0, MESSAGES.VALIDATION.SHIPPING_PRICE_MIN),
	shippingMethod: z.string().min(1, MESSAGES.VALIDATION.SHIPPING_METHOD_REQUIRED)
});

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) {
		throw redirect(303, '/client/auth');
	}

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = cartItemsRaw as CartItem[];

	const paymentForm = await superValidate(zod(paymentFormSchema));

	return { paymentForm, cartItems };
};

export const actions = {
	default: async ({ request, locals }: RequestEvent) => {
		if (!locals.user) {
			return fail(401, { error: STRINGS.COMMON.UNAUTHORIZED });
		}

		const paymentForm = await superValidate(request, zod(paymentFormSchema));
		if (!paymentForm.valid) return fail(422, { paymentForm });

		const { shippingAddress, shippingPrice, shippingMethod } = paymentForm.data;

		try {
			// SECURITY: Always fetch cart from DB, don't trust client JSON payload
			const cartItemsRaw = await getCartItems(locals.user.id);
			const serverCartItems = cartItemsRaw as CartItem[];

			if (!serverCartItems || serverCartItems.length === 0) {
				throw new ConflictException(MESSAGES.VALIDATION.CART_EMPTY);
			}

			// Calculate total securely on server
			let calculatedSubtotal = 0;
			for (const item of serverCartItems) {
				calculatedSubtotal += item.price * item.quantity;
			}
			const calculatedTotal = calculatedSubtotal + Number(shippingPrice);

			const result = await processPayment(
				locals.user.id,
				serverCartItems,
				calculatedTotal,
				shippingAddress as string,
				shippingPrice as number,
				shippingMethod as string
			);

			return message(paymentForm, {
				status: 'success',
				text: STRINGS.CHECKOUT.MESSAGES.PAYMENT_SUCCESS,
				snapToken: result.snapToken
			});
		} catch (err) {
			const error = err as Error;
			logger.error('Payment processing error:', error);
			return message(paymentForm, error.message || STRINGS.CHECKOUT.MESSAGES.PAYMENT_FAILED, {
				status: 500
			});
		}
	}
};
