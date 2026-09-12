import { redirect, fail } from '@sveltejs/kit';

import { getCartItems, addToCart, deleteFromCart } from '$lib/server/services/cartService.js';
import { HTTP_STATUS } from '$lib/constants/config.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';
import { STRINGS } from '$lib/constants/strings.js';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.AUTH);

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
		image: item.image || STRINGS.SHOP.FALLBACK_IMAGE
	}));
	return { cartItems };
};

export const actions = {
	updateQuantity: async ({ request, locals }: RequestEvent) => {
		if (!locals.user) return fail(HTTP_STATUS.UNAUTHORIZED);
		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		const delta = Number(formData.get('delta'));
		try {
			await addToCart(locals.user.id, productId, delta);
			return { success: true };
		} catch (error) {
			return fail(HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: (error as Error).message });
		}
	},
	remove: async ({ request, locals }: RequestEvent) => {
		if (!locals.user) return fail(HTTP_STATUS.UNAUTHORIZED);
		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		try {
			await deleteFromCart(locals.user.id, productId);
			return { success: true };
		} catch (error) {
			return fail(HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: (error as Error).message });
		}
	}
};
