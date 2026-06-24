import { getCartItems } from '$lib/server/services/cartService.js';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
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

	return { cartItems };
};
