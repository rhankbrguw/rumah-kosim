import type { RequestHandler } from '@sveltejs/kit';

import { registerUser } from '$lib/server/services/authService.js';
import { AUTH_COOKIE_OPTIONS, HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { registerSchema } from '$lib/server/validations/auth.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const validation = registerSchema.safeParse(body);

	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	const { username, password, email } = validation.data;

	try {
		const result = await registerUser(username, password, email);

		if (result.isFirstUser && result.token) {
			cookies.set('authToken', result.token, AUTH_COOKIE_OPTIONS);
			return jsonResponse({ user: result.user }, MESSAGES.SUCCESS.CREATE, HTTP_STATUS.CREATED);
		} else {
			return jsonResponse(
				{ user: result.user, message: 'OTP sent to email.' },
				MESSAGES.SUCCESS.CREATE,
				HTTP_STATUS.CREATED
			);
		}
	} catch (error) {
		logger.error('Database error during registration:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
