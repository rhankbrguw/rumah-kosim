import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { paymentSchema } from '$lib/server/validations/checkout.js';
import { processPayment } from '$lib/server/services/checkoutService.js';

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
	const validation = paymentSchema.safeParse(body);

	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	const { cartItems, total, shippingAddress, shippingPrice, shippingMethod } = validation.data;

	try {
		const { orderId, trackingNumber } = await processPayment(
			userId,
			cartItems,
			total,
			shippingAddress,
			shippingPrice,
			shippingMethod
		);

		return jsonResponse(
			{ orderId, trackingNumber },
			'Order processed successfully',
			HTTP_STATUS.OK
		);
	} catch (err) {
		logger.error('Payment processing error:', err as Error);
		return errorResponse(
			'Payment processing failed',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			(err as Error).message
		);
	}
}
