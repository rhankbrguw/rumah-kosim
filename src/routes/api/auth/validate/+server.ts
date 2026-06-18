import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { validateTokenSchema } from '$lib/server/validations/auth.js';

export async function POST({ request }) {
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
		const payload = jwt.verify(token, JWT_SECRET);
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
	} catch {
		return errorResponse('Invalid token', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHENTICATED);
	}
}
