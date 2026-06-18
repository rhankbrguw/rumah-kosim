import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { addressSchema } from '$lib/server/validations/checkout.js';
import { getAddress, updateAddress } from '$lib/server/services/checkoutService.js';

const getUserIdFromAuth = (request: Request) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.replace('Bearer ', '');
	if (!token) return null;

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded.id;
	} catch {
		return null;
	}
};

export async function GET({ request }) {
	const userId = getUserIdFromAuth(request);
	if (!userId) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	try {
		const address = await getAddress(userId);
		return jsonResponse({ address }, MESSAGES.SUCCESS.FETCH);
	} catch (err) {
		logger.error('GET Address Error:', err as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}

export async function POST({ request }) {
	const userId = getUserIdFromAuth(request);
	if (!userId) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	const body = await request.json();
	const validation = addressSchema.safeParse(body);

	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	const { address } = validation.data;

	try {
		await updateAddress(userId, address);
		return jsonResponse(null, MESSAGES.SUCCESS.UPDATE);
	} catch (err) {
		logger.error('POST Address Error:', err as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
