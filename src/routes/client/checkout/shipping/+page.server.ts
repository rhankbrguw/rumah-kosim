import { getCartItems } from '$lib/server/services/cartService.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: any) => {
	if (!locals.user) {
		throw redirect(303, '/client/login');
	}

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = cartItemsRaw as unknown as { price: number, quantity: number, title?: string, image?: string }[];
	
	return { cartItems };
};
