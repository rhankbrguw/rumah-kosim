import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';

export const productIdSchema = z.object({
	id: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => !isNaN(val) && val > 0, { message: MESSAGES.VALIDATION.PRODUCT_ID_INVALID })
});

export const productCreateSchema = z.object({
	title: z.string().min(1, MESSAGES.VALIDATION.TITLE_REQUIRED).trim(),
	price: z.coerce.number().positive(MESSAGES.VALIDATION.PRICE_VALID),
	image: z.string().min(1, MESSAGES.VALIDATION.IMAGE_REQUIRED).trim(),
	description: z
		.string()
		.min(1, MESSAGES.VALIDATION.DESCRIPTION_REQUIRED)
		.max(255, MESSAGES.VALIDATION.DESCRIPTION_MAX_LENGTH)
		.trim(),
	quantity: z.coerce.number().int().min(0, MESSAGES.VALIDATION.QUANTITY_VALID)
});
