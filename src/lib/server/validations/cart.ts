import { z } from 'zod';

export const addToCartSchema = z.object({
	productId: z.coerce.number({ message: 'Product ID is required' }).int().positive(),
	quantity: z.coerce.number({ message: 'Quantity is required' }).int()
});

export const deleteFromCartSchema = z.object({
	productId: z.coerce.number({ message: 'Product ID is required' }).int().positive()
});
