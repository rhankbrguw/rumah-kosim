import { getOrders } from '$lib/server/services/orderService.js';
import { createReview } from '$lib/server/services/reviewService.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';
import { APP_CONFIG } from '$lib/constants/config.js';
import type { RequestEvent } from '@sveltejs/kit';
import type { Order } from '$lib/types';

const reviewSchema = z.object({
	orderId: z.coerce.number(),
	productId: z.coerce.number(),
	rating: z.coerce.number().min(1).max(5),
	comment: z.string().min(1, 'Review cannot be empty').max(1000, 'Review is too long')
});

export const load = async ({ locals, url }: RequestEvent) => {
	if (!locals.user) {
		throw redirect(303, '/client/auth');
	}
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;

	const historyRaw = await getOrders(locals.user.id, page, limit);

	const history: Order[] = historyRaw.data.map((item) => {
		const orderItem = item as Record<string, unknown>;
		return {
			...orderItem,
			id: orderItem.id,
			user_id: orderItem.user_id,
			total: orderItem.total,
			shipping_address: orderItem.shipping_address
		} as Order;
	});

	const total = historyRaw.total;

	const reviewForm = await superValidate(zod(reviewSchema));

	return { history, total, page, limit, reviewForm };
};

export const actions = {
	review: async ({ request, locals }: RequestEvent) => {
		if (!locals.user) {
			return fail(401, { error: STRINGS.COMMON.UNAUTHORIZED });
		}

		const reviewForm = await superValidate(request, zod(reviewSchema));
		if (!reviewForm.valid) return fail(422, { reviewForm });

		try {
			await createReview(
				reviewForm.data.orderId as number,
				reviewForm.data.productId as number,
				locals.user.id as number,
				reviewForm.data.rating as number,
				reviewForm.data.comment as string
			);
			return message(reviewForm, STRINGS.PROFILE.MESSAGES.REVIEW_SUCCESS);
		} catch (error) {
			const typedError = error as Error & { code?: string };
			logger.error('Error submitting review:', typedError);
			if (typedError.code === 'ER_DUP_ENTRY') {
				return message(reviewForm, STRINGS.PROFILE.MESSAGES.REVIEW_DUPLICATE, { status: 409 });
			}
			return message(reviewForm, STRINGS.PROFILE.MESSAGES.REVIEW_FAILED, { status: 500 });
		}
	}
};
