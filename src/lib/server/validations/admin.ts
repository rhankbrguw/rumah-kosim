import { z } from 'zod';

export const adminProductSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().min(0),
	quantity: z.coerce.number().int().min(0),
	image: z.string().min(1, 'Image is required')
});

export const adminEditProductSchema = z.object({
	id: z.coerce.number(),
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().min(0),
	quantity: z.coerce.number().int().min(0),
	image: z.string().min(1, 'Image is required')
});

export const adminOrderStatusSchema = z.object({
	id: z.coerce.number(),
	status: z.enum(['Processing', 'Shipped', 'Delivered', 'Cancelled'])
});

export const adminDeleteSchema = z.object({
	id: z.coerce.number()
});
