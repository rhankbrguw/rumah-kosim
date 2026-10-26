import type { RequestEvent } from '@sveltejs/kit';
import { getCartItems } from '$lib/server/services/cartService.js';
import { getUserById } from '$lib/server/services/authService.js';
import { logger } from '$lib/server/utils/logger.js';

interface CartItemBase {
	quantity: number;
}

const countCartQuantity = (items: unknown) =>
	Array.isArray(items)
		? (items as CartItemBase[]).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
		: 0;

const formatUserSummary = (
	user: NonNullable<App.Locals['user']>,
	avatar: string | null = null
) => ({
	id: user.id,
	username: user.username,
	email: user.email,
	role: user.role,
	avatar
});

const loadUserData = async (user: NonNullable<App.Locals['user']>) => {
	try {
		const [items, record] = await Promise.all([
			getCartItems(user.id).catch(() => []),
			getUserById(user.id).catch(() => null)
		]);
		return {
			user: formatUserSummary(user, record?.avatar || null),
			cartCount: countCartQuantity(items)
		};
	} catch (err) {
		logger.warn('Failed to fetch user cart/record in layout load:', {
			error: (err as Error).message
		});
		return { user: formatUserSummary(user, null), cartCount: 0 };
	}
};

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) {
		return { user: null, cartCount: 0 };
	}
	return await loadUserData(locals.user);
};
