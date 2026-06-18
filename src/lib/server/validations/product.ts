import { z } from 'zod';

export const productIdSchema = z.object({
	id: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => !isNaN(val) && val > 0, { message: 'Invalid product ID' })
});

export const productCreateSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	price: z.number().positive('Price must be positive'),
	image: z.string().url('Invalid image URL').or(z.string().startsWith('/', 'Invalid local path')),
	description: z.string().min(1, 'Description is required'),
	quantity: z.number().int().min(0, 'Quantity cannot be negative')
});

export const productUpdateSchema = productCreateSchema.partial().extend({
	id: z.number().positive('Invalid product ID')
});
