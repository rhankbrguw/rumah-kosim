import type { RequestEvent } from '@sveltejs/kit';
import { getCartItems } from '$lib/server/services/cartService.js';
import { getUserById } from '$lib/server/services/authService.js';
import { logger } from '$lib/server/utils/logger.js';

interface CartItemBase {
	quantity: number;
}

export const load = async ({ locals }: RequestEvent) => {
	let cartCount = 0;
	let currentUser = null;

	if (locals.user) {
		let userRecord = null;
		try {
			const [items, record] = await Promise.all([
				getCartItems(locals.user.id).catch(() => []),
				getUserById(locals.user.id).catch(() => null)
			]);

			cartCount = (items as CartItemBase[]).reduce(
				(sum, item) => sum + (Number(item.quantity) || 0),
				0
			);
			userRecord = record;
		} catch (err) {
			logger.warn('Failed to fetch user cart/record in layout load:', {
				error: (err as Error).message
			});
		}

		currentUser = {
			id: locals.user.id,
			username: locals.user.username,
			email: locals.user.email,
			role: locals.user.role,
			avatar: userRecord?.avatar || null
		};
	}

	return {
		user: currentUser,
		cartCount
	};
};
