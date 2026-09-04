import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { logger } from '$lib/server/utils/logger.js';
import * as OrderService from '$lib/server/services/orderService.js';
import { snap } from '$lib/server/utils/midtrans.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	try {
		const notification = await request.json();
		const orderId = notification.order_id;
		if (!orderId) {
			return errorResponse(
				MESSAGES.VALIDATION.MIDTRANS_ORDER_ID_REQUIRED,
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		let transactionStatus = notification.transaction_status;
		let fraudStatus = notification.fraud_status;

		if (!transactionStatus || notification.status_code === '200') {
			try {
				const statusResponse = await snap.transaction.status(orderId);
				if (statusResponse?.transaction_status) {
					transactionStatus = statusResponse.transaction_status;
					fraudStatus = statusResponse.fraud_status;
				}
			} catch (error) {
				logger.error('Midtrans status verification failed:', error as Error);
				return errorResponse(
					MESSAGES.ERROR.PAYMENT_VERIFICATION_FAILED,
					HTTP_STATUS.INTERNAL_SERVER_ERROR,
					ERROR_CODES.INTERNAL_ERROR
				);
			}
		}

		if (!transactionStatus) {
			return errorResponse(
				MESSAGES.ERROR.PAYMENT_STATUS_MISSING,
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		const newStatus = OrderService.resolvePaymentStatus(
			transactionStatus || 'settlement',
			fraudStatus || 'accept'
		);

		logger.info(`Midtrans notification processed. Order: ${orderId}, Status: ${newStatus}`);
		await OrderService.updateOrderStatusByTrackingNumber(orderId, newStatus);

		return jsonResponse({ status: newStatus }, 'Notification processed');
	} catch (error) {
		logger.error('Midtrans Webhook Error:', error as Error);
		return errorResponse('Internal Server Error', 500, undefined, error);
	}
};
