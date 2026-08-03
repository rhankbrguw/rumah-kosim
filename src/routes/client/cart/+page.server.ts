import { redirect, fail } from '@sveltejs/kit';
import { getCartItems, addToCart, deleteFromCart } from '$lib/server/services/cartService.js';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) throw redirect(303, '/client/auth');

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = (
		cartItemsRaw as {
			product_id: number;
			price: number;
			quantity: number;
			title: string;
			image: string;
		}[]
	).map((item) => ({
		...item,
		image: item.image || `/images/placeholder.jpg`
	}));
	return { cartItems };
};

export const actions = {
	updateQuantity: async ({ request, locals }) => {
		if (!locals.user) return fail(401);
		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		const delta = Number(formData.get('delta'));
		try {
			await addToCart(locals.user.id, productId, delta);
			return { success: true };
		} catch (error) {
			return fail(500, { error: (error as Error).message });
		}
	},
	remove: async ({ request, locals }) => {
		if (!locals.user) return fail(401);
		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		try {
			await deleteFromCart(locals.user.id, productId);
			return { success: true };
		} catch (error) {
			return fail(500, { error: (error as Error).message });
		}
	}
};
