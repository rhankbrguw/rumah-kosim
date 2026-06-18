import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { getOrders } from '$lib/server/services/orderService.js';

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
		const orders = await getOrders(userId);
		return jsonResponse(orders, MESSAGES.SUCCESS.FETCH);
	} catch (error) {
		logger.error('Error fetching orders:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
