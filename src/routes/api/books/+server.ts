import { ProductService } from '$lib/server/services/productService.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { HTTP_STATUS, ERROR_CODES, APP_CONFIG } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { MESSAGES } from '$lib/constants/messages.js';

export async function GET({ url }) {
	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
		const search = url.searchParams.get('search') || undefined;
		const books = await ProductService.getAll(page, limit, search);
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
