import { redirect, fail } from '@sveltejs/kit';
import { getCartItems, addToCart, deleteFromCart } from '$lib/server/services/cartService.js';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) throw redirect(303, '/client/auth');

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = (cartItemsRaw as unknown as { product_id: number; price: number; quantity: number; title: string; image: string; }[]).map((item) => ({
		...item,
		image: `/images/${item.image?.split('/').pop() || `buku${item.product_id}.jpg`}`
	}));
	return { cartItems };
};

export const actions = {
	updateQuantity: async ({ request, locals }) => {
		if (!locals.user) return fail(401);
		const data = await request.formData();
		const productId = Number(data.get('productId'));
		const delta = Number(data.get('delta'));
		try {
			await addToCart(locals.user.id, productId, delta);
			return { success: true };
		} catch (err) {
			return fail(500, { error: (err as Error).message });
		}
	},
	remove: async ({ request, locals }) => {
		if (!locals.user) return fail(401);
		const data = await request.formData();
		const productId = Number(data.get('productId'));
		try {
			await deleteFromCart(locals.user.id, productId);
			return { success: true };
		} catch (err) {
			return fail(500, { error: (err as Error).message });
		}
	}
};
