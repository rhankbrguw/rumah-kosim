import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';

export const addToCartSchema = z.object({
	productId: z.coerce.number({ message: MESSAGES.VALIDATION.PRODUCT_ID_REQUIRED }).int().positive(),
	quantity: z.coerce.number({ message: MESSAGES.VALIDATION.QUANTITY_REQUIRED }).int()
});

export const deleteFromCartSchema = z.object({
	productId: z.coerce.number({ message: MESSAGES.VALIDATION.PRODUCT_ID_REQUIRED }).int().positive()
});
