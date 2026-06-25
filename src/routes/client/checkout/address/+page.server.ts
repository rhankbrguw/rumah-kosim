import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect, fail } from '@sveltejs/kit';
import { getCartItems } from '$lib/server/services/cartService.js';
import { getUserAddresses, saveUserAddress } from '$lib/server/services/authService.js';
import { STRINGS } from '$lib/constants/strings';

const addressSchema = z.object({
	firstName: z.string().min(1, 'Required'),
	lastName: z.string().min(1, 'Required'),
	address: z.string().min(10, 'Address must be at least 10 characters'),
	apartment: z.string().optional(),
	city: z.string().min(1, 'Required'),
	district: z.string().min(1, 'Required'),
	subdistrict: z.string().min(1, 'Required'),
	postalCode: z.string().min(5, 'Required'),
	province: z.string().default('JABODETABEK'),
	saveInfo: z.boolean().optional(),
	addressLabel: z.string().optional(),
	cartItemsJson: z.string().optional(),
	subtotal: z.number().optional(),
	shippingCost: z.number().optional(),
	total: z.number().optional()
});

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/client/auth');

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = (cartItemsRaw as unknown as any[]).map((item) => ({
		...item,
		image: `/images/${item.image?.split('/').pop() || `buku${item.product_id}.jpg`}`
	}));

	const userAddresses = await getUserAddresses(locals.user.id);

	const form = await superValidate(zod(addressSchema));
	if (userAddresses.length > 0 && userAddresses[0].address_text) {
		try {
			const primary = userAddresses.find(a => a.is_primary) || userAddresses[0];
			const parsed = JSON.parse(primary.address_text);
			Object.assign(form.data, parsed);
		} catch (e) {}
	}

	return { form, cartItems, userAddresses };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/client/auth');

		const form = await superValidate(request, zod(addressSchema));
		if (!form.valid) {
			return fail(422, { form });
		}

		if (form.data.saveInfo) {
			const label = form.data.addressLabel || 'Rumah';
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

		throw redirect(303, '/client/checkout/shipping');
	}
};
