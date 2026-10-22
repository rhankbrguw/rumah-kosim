import type { RequestHandler } from '@sveltejs/kit';

import { ProductService } from '$lib/server/services/productService.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { productIdSchema } from '$lib/server/validations/product.js';

const attachEditorialReview = (product: Record<string, unknown>) => {
	const title = String(product.title || '');
	product.editorialReview = {
		headline: `The #1 Bestseller: ${title}\nOver 10 million copies sold!`,
		body: `Discover the groundbreaking insights of ${title}.\n\nNo matter your goals, this book offers a proven framework for improving. Critics and readers alike are raving about this masterpiece. Whether you're looking to change your perspective or just find a captivating read, ${title} delivers an unforgettable experience that will leave a lasting impact.\n\n"A truly remarkable journey from start to finish." — The Book Review`
	};
};

export const GET: RequestHandler = async ({ url }) => {
	const rawId = url.searchParams.get('id');
	const validation = productIdSchema.safeParse({ id: rawId });
	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.flatten().fieldErrors
		);
	}

	try {
		const product = await ProductService.getById(validation.data.id);
		if (!product) {
			return errorResponse(MESSAGES.ERROR.NOT_FOUND, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
		}
		attachEditorialReview(product);
		return jsonResponse(product, MESSAGES.SUCCESS.FETCH);
	} catch (error) {
		logger.error('Error fetching product:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.SERVER,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
