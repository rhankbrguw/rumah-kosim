import type { RequestHandler } from '@sveltejs/kit';

import { validateToken } from '$lib/server/services/authService.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { validateTokenSchema } from '$lib/server/validations/auth.js';
import { logger } from '$lib/server/utils/logger.js';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const validation = validateTokenSchema.safeParse(body);

	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	const { token } = validation.data;

	try {
		const payload = validateToken(token) as Record<string, unknown>;
		return jsonResponse(
			{
				user: {
					username: payload.username,
					email: payload.email,
					role: payload.role
				}
			},
			MESSAGES.SUCCESS.AUTH
		);
	} catch (err) {
		logger.warn('Token validation failed', { error: (err as Error).message });
		return errorResponse('Invalid token', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHENTICATED);
	}
};
