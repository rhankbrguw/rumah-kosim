import { getCartItems } from '$lib/server/services/cartService.js';
import { redirect } from '@sveltejs/kit';
import { HTTP_STATUS } from '$lib/constants/config.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) {
		throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.AUTH);
	}

	const cartItemsRaw = await getCartItems(locals.user.id);
	const cartItems = cartItemsRaw as {
		price: number;
		quantity: number;
		title?: string;
		image?: string;
	}[];

	return { cartItems };
};
