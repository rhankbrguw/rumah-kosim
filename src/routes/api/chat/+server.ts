import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { chatWithAI } from '$lib/server/services/aiService.js';
import type { RequestHandler } from './$types';
import { logger } from '$lib/server/utils/logger.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message, history } = await request.json();
		
		if (!message) {
			return errorResponse('Message is required', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
		}

		const responseText = await chatWithAI(message, history || []);
		
		return jsonResponse({ response: responseText });
	} catch (error) {
		logger.error('Chat API Error:', error as Error);
		return errorResponse('Internal Server Error', HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
	}
};
