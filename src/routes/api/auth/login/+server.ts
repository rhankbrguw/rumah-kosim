import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { APP_CONFIG, HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { loginSchema } from '$lib/server/validations/auth.js';
import { getUserByUsername } from '$lib/server/services/authService.js';

export async function POST({ request, locals, cookies }) {
	const body = await request.json();
	const validation = loginSchema.safeParse(body);

	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	const { username, password } = validation.data;
	let user;

	try {
		user = await getUserByUsername(username);
	} catch (error) {
		logger.error('Database error during login:', error as Error, { correlationId: locals?.correlationId });
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}

	if (!user) {
		return errorResponse(
			'Invalid username or password',
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHENTICATED
		);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return errorResponse(
			'Invalid username or password',
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHENTICATED
		);
	}

	const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });

	cookies.set('authToken', token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 // 1 day
	});

	return jsonResponse(
		{
			user: { username: user.username, email: user.email, role: user.role }
		},
		MESSAGES.SUCCESS.AUTH
	);
}
