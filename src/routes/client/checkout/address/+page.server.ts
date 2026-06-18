import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect, fail } from '@sveltejs/kit';
import { getCartItems } from '$lib/server/services/cartService.js';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

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
	cartItemsJson: z.string().optional(),
	subtotal: z.number().optional(),
	shippingCost: z.number().optional(),
	total: z.number().optional()
});

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/client/login');

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = (cartItemsRaw as unknown as any[]).map(item => ({
		...item,
		image: `/images/${item.image?.split('/').pop() || `buku${item.product_id}.jpg`}`
	}));

	const rows = (await db.query('SELECT address FROM users WHERE id = ?', [locals.user.id])) as unknown as any[];
	const userAddress = rows[0]?.address || '';

	const form = await superValidate(zod(addressSchema));
	if (userAddress) form.data.address = userAddress;

	return { form, cartItems };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/client/login');
		const form = await superValidate(request, zod(addressSchema));
		if (!form.valid) return fail(400, { form });

		if (form.data.saveInfo && form.data.address) {
			await db.query('UPDATE users SET address = ? WHERE id = ?', [form.data.address, locals.user.id]);
		}

		return message(form, 'Address validated successfully');
	}
};
