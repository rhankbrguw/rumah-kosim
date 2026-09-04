import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';

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
		.min(1, MESSAGES.VALIDATION.CART_ITEMS_REQUIRED),
	total: z.coerce.number().positive(MESSAGES.VALIDATION.TOTAL_POSITIVE),
	shippingAddress: z.string().min(1, MESSAGES.VALIDATION.SHIPPING_ADDRESS_REQUIRED),
	shippingPrice: z.coerce.number().min(0, MESSAGES.VALIDATION.SHIPPING_PRICE_MIN),
	shippingMethod: z.string().min(1, MESSAGES.VALIDATION.SHIPPING_METHOD_REQUIRED)
});
