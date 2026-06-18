import { ProductService } from '$lib/server/services/productService.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { MESSAGES } from '$lib/constants/messages.js';

export async function GET() {
	try {
		const books = await ProductService.getAll();
		return jsonResponse(books, MESSAGES.SUCCESS.FETCH);
	} catch (error) {
		logger.error('Error fetching books:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.SERVER,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
