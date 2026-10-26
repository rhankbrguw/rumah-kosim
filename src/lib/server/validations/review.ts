import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';

export const createReviewSchema = z.object({
	orderId: z.coerce.number().int().positive(),
	productId: z.coerce.number().int().positive(),
	rating: z.coerce
		.number()
		.int()
		.min(1, MESSAGES.VALIDATION.RATING_RANGE)
		.max(5, MESSAGES.VALIDATION.RATING_RANGE),
	comment: z.string().min(1, MESSAGES.VALIDATION.COMMENT_REQUIRED)
});
