import { z } from 'zod';

export const createReviewSchema = z.object({
	orderId: z.coerce.number().int().positive(),
	productId: z.coerce.number().int().positive(),
	rating: z.coerce
		.number()
		.int()
		.min(1, 'Rating must be between 1 and 5')
		.max(5, 'Rating must be between 1 and 5'),
	comment: z.string().min(1, 'Comment is required')
});
