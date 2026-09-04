import type { RequestHandler } from '@sveltejs/kit';

import { ProductService } from '$lib/server/services/productService.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { logger } from '$lib/server/utils/logger.js';
import { checkAdmin } from '$lib/server/admin-guard.js';

export const PATCH: RequestHandler = async ({ request }) => {
	if (!(await checkAdmin(request))) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	try {
		const { productId, quantity } = await request.json();

		if (!productId || quantity === undefined) {
			return errorResponse(
				MESSAGES.ERROR.VALIDATION,
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		await ProductService.updateQuantity(productId, quantity);

		return jsonResponse(null, MESSAGES.SUCCESS.UPDATE);
	} catch (error) {
		logger.error('Stock update error:', error as Error);
		return errorResponse(
			(error as Error).message,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
