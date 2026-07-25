import { APP_CONFIG, HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { STRINGS } from '$lib/constants/strings.js';
import { loginSchema } from '$lib/server/validations/auth.js';
import { loginUser } from '$lib/server/services/authService.js';
import { AuthException } from '$lib/server/utils/exceptions.js';

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

	try {
		const { user, token } = await loginUser(username, password, false);

		cookies.set('authToken', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: APP_CONFIG.COOKIE_MAX_AGE
		});

		return jsonResponse(
			{
				user: { username: user.username, email: user.email, role: user.role, avatar: user.avatar }
			},
			MESSAGES.SUCCESS.AUTH
		);
	} catch (error) {
		if (error instanceof AuthException && error.message === 'INVALID_CREDENTIALS') {
			return errorResponse(
				STRINGS.AUTH.MESSAGES.INVALID_CREDENTIALS,
				HTTP_STATUS.UNAUTHORIZED,
				ERROR_CODES.UNAUTHENTICATED
			);
		}

		logger.error('Database error during login:', error as Error, {
			correlationId: locals?.correlationId
		});
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
