import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { APP_CONFIG, HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { registerSchema } from '$lib/server/validations/auth.js';
import { createUser } from '$lib/server/services/authService.js';

export async function POST({ request, cookies }) {
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
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await createUser(username, hashedPassword, email);
	} catch (error) {
		logger.error('Database error during registration:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}

	const payload = { username, email, role: 'user' }; // defaults to user
	const token = jwt.sign(payload, JWT_SECRET, {
		expiresIn: APP_CONFIG.JWT_EXPIRES_IN
	});

	cookies.set('authToken', token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 // 1 day
	});

	return jsonResponse(
		{ user: { username, email, role: 'user' } },
		MESSAGES.SUCCESS.CREATE,
		HTTP_STATUS.CREATED
	);
}
