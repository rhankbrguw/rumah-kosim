import { z } from 'zod';
import { ORDER_STRINGS } from '$lib/constants/orderStrings.js';
import { MESSAGES } from '$lib/constants/messages.js';

export const adminProductSchema = z.object({
	title: z.string().min(1, MESSAGES.VALIDATION.TITLE_REQUIRED),
	description: z.string().min(1, MESSAGES.VALIDATION.DESCRIPTION_REQUIRED),
	price: z.coerce.number().min(0),
	quantity: z.coerce.number().int().min(0),
	image: z.string().min(1, MESSAGES.VALIDATION.IMAGE_REQUIRED)
});

export const adminEditProductSchema = z.object({
	id: z.coerce.number(),
	title: z.string().min(1, MESSAGES.VALIDATION.TITLE_REQUIRED),
	description: z.string().min(1, MESSAGES.VALIDATION.DESCRIPTION_REQUIRED),
	price: z.coerce.number().min(0),
	quantity: z.coerce.number().int().min(0),
	image: z.string().min(1, MESSAGES.VALIDATION.IMAGE_REQUIRED)
});

export const adminOrderStatusSchema = z.object({
	id: z.coerce.number(),
	status: z.enum([
		ORDER_STRINGS.STATUS_PROCESSING,
		ORDER_STRINGS.STATUS_SHIPPED,
		ORDER_STRINGS.STATUS_DELIVERED,
		ORDER_STRINGS.STATUS_CANCELLED
	])
});

export const adminDeleteSchema = z.object({
	id: z.coerce.number()
});
