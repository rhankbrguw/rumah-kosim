import type { LayoutServerLoad } from './$types';
import { getCartItems } from '$lib/server/services/cartService.js';

interface CartItemBase {
	quantity: number;
}

export const load: LayoutServerLoad = async ({ locals }) => {
	let cartCount = 0;
	if (locals.user) {
		const items = await getCartItems(locals.user.id);
		cartCount = (items as CartItemBase[]).reduce(
			(sum, item) => sum + (Number(item.quantity) || 0),
			0
		);
	}
	return {
		user: locals.user || null,
		cartCount
	};
};
