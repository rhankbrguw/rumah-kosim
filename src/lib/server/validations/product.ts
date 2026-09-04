import { z } from 'zod';

export const productIdSchema = z.object({
	id: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => !isNaN(val) && val > 0, { message: 'Invalid product ID' })
});

export const productCreateSchema = z.object({
	title: z.string().min(1, 'Title is required').trim(),
	price: z.coerce.number().positive('Valid price is required'),
	image: z.string().min(1, 'Image is required').trim(),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description must be less than 255 characters')
		.trim(),
	quantity: z.coerce.number().int().min(0, 'Valid quantity is required')
});
