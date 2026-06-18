import { z } from 'zod';

export const addressSchema = z.object({
	address: z.string().min(10, 'Address must be at least 10 characters')
});

export const paymentSchema = z.object({
	cartItems: z
		.array(
			z.object({
				product_id: z.coerce.number().int().positive(),
				quantity: z.coerce.number().int().positive(),
				price: z.coerce.number().positive()
			})
		)
		.min(1, 'Cart items cannot be empty'),
	total: z.coerce.number().positive(),
	shippingAddress: z.string().min(1, 'Shipping address is required'),
	shippingPrice: z.coerce.number().min(0),
	shippingMethod: z.string().min(1, 'Shipping method is required')
});
