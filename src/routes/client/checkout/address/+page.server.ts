import type { RequestEvent } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect, fail } from '@sveltejs/kit';

import { getCartItems } from '$lib/server/services/cartService.js';
import { getUserById } from '$lib/server/services/authService.js';
import { getUserAddresses, saveUserAddress } from '$lib/server/services/profileService.js';
import type { CartItem, UserAddress } from '$lib/types';
import { logger } from '$lib/server/utils/logger.js';
import { HTTP_STATUS } from '$lib/constants/config.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';
import { STRINGS } from '$lib/constants/strings.js';

const addressSchema = z.object({
	firstName: z.string().min(1, STRINGS.VALIDATION.REQUIRED),
	lastName: z.string().min(1, STRINGS.VALIDATION.REQUIRED),
	address: z.string().min(10, STRINGS.VALIDATION.ADDRESS_MIN_LENGTH),
	apartment: z.string().optional(),
	city: z.string().min(1, STRINGS.VALIDATION.REQUIRED),
	district: z.string().min(1, STRINGS.VALIDATION.REQUIRED),
	subdistrict: z.string().min(1, STRINGS.VALIDATION.REQUIRED),
	postalCode: z.string().min(5, STRINGS.VALIDATION.REQUIRED),
	province: z.string().default('JABODETABEK'),
	saveInfo: z.boolean().optional(),
	addressLabel: z.string().optional(),
	cartItemsJson: z.string().optional(),
	subtotal: z.number().optional(),
	shippingCost: z.number().optional(),
	total: z.number().optional()
});

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.AUTH);

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = (cartItemsRaw as CartItem[]).map((item) => ({
		...item,
		image: item.image || STRINGS.SHOP.FALLBACK_IMAGE
	}));

	const userAddresses = await getUserAddresses(locals.user.id);
	const form = await superValidate(zod(addressSchema));

	if (userAddresses.length > 0 && userAddresses[0].address_text) {
		try {
			const primary =
				(userAddresses as UserAddress[]).find((a: UserAddress) => a.is_primary) || userAddresses[0];
			const parsed = JSON.parse(primary.address_text);
			Object.assign(form.data, parsed);
		} catch (e) {
			logger.warn('Failed to parse user address JSON', { error: (e as Error).message });
		}
	} else {
		const user = await getUserById(locals.user.id);
		if (user && user.address) {
			form.data.address = user.address;
		}
	}

	return { form, cartItems, userAddresses };
};

export const actions = {
	default: async ({ request, locals }: RequestEvent) => {
		if (!locals.user) throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.AUTH);

		const form = await superValidate(request, zod(addressSchema));
		if (!form.valid) {
			return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });
		}

		if (form.data.saveInfo) {
			const label = form.data.addressLabel || STRINGS.PROFILE.ADDRESS_BOOK.DEFAULT_LABEL;
			const addressData = {
				firstName: form.data.firstName,
				lastName: form.data.lastName,
				address: form.data.address,
				apartment: form.data.apartment,
				city: form.data.city,
				district: form.data.district,
				subdistrict: form.data.subdistrict,
				postalCode: form.data.postalCode,
				province: form.data.province
			};
			await saveUserAddress(locals.user.id, label, JSON.stringify(addressData), false);
		}

		throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.CHECKOUT_SHIPPING);
	}
};
