import type { RequestHandler } from '@sveltejs/kit';
import { getPendingPaymentToken } from '$lib/server/services/checkoutService.js';
import { errorResponse, jsonResponse } from '$lib/server/utils/response.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { MESSAGES } from '$lib/constants/messages.js';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHENTICATED
		);
	}

	const orderId = Number(params.id);
	if (!Number.isInteger(orderId) || orderId <= 0) {
		return errorResponse(
			MESSAGES.VALIDATION.ORDER_ID_INVALID,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR
		);
	}

	const payment = await getPendingPaymentToken(orderId, locals.user.id);
	if (!payment) {
		return errorResponse(
			MESSAGES.ERROR.PENDING_PAYMENT_NOT_FOUND,
			HTTP_STATUS.NOT_FOUND,
			ERROR_CODES.NOT_FOUND
		);
	}

	return jsonResponse(payment, MESSAGES.SUCCESS.PENDING_PAYMENT_RETRIEVED);
};
