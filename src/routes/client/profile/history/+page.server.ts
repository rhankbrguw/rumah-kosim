import { getOrders } from '$lib/server/services/orderService.js';
import { createReview } from '$lib/server/services/reviewService.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';

const reviewSchema = z.object({
	orderId: z.coerce.number(),
	productId: z.coerce.number(),
	rating: z.coerce.number().min(1).max(5),
	comment: z.string().min(1, 'Review cannot be empty').max(1000, 'Review is too long')
});

export const load = async ({ locals }: any) => {
	if (!locals.user) {
		throw redirect(303, '/client/auth');
	}

	const historyRaw = await getOrders(locals.user.id);
	const history = historyRaw as unknown as {
		id: number;
		date: string;
		tracking_number: string;
		status: string;
		total: number;
		shipping_method: string;
		shipping_address: string;
		items: any[];
	}[];

	const reviewForm = await superValidate(zod(reviewSchema));

	return { history, reviewForm };
};

export const actions = {
	review: async ({ request, locals }: any) => {
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
		} catch (error: any) {
			logger.error('Error submitting review:', error);
			if (error.code === 'ER_DUP_ENTRY') {
				return message(reviewForm, STRINGS.PROFILE.MESSAGES.REVIEW_DUPLICATE, { status: 409 });
			}
			return message(reviewForm, STRINGS.PROFILE.MESSAGES.REVIEW_FAILED, { status: 500 });
		}
	}
};
