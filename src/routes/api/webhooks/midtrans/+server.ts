import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { logger } from '$lib/server/utils/logger.js';
import * as OrderService from '$lib/server/services/orderService.js';
import { snap } from '$lib/server/utils/midtrans.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { MIDTRANS_TRANSACTION_STATUS, MIDTRANS_FRAUD_STATUS } from '$lib/constants/orderStrings.js';

const resolveMidtransStatuses = async (orderId: string, notification: Record<string, string>) => {
	let transactionStatus = notification.transaction_status;
	let fraudStatus = notification.fraud_status;

	if (!transactionStatus || notification.status_code === String(HTTP_STATUS.OK)) {
		try {
			const statusResponse = await snap.transaction.status(orderId);
			if (statusResponse?.transaction_status) {
				transactionStatus = statusResponse.transaction_status;
				fraudStatus = statusResponse.fraud_status;
			}
		} catch (error) {
			logger.error('Midtrans status verification failed:', error as Error);
		}
	}
	return { transactionStatus, fraudStatus };
};

const applyOrderPaymentStatus = async (
	orderId: string,
	transactionStatus: string,
	fraudStatus: string
) => {
	const newStatus = OrderService.resolvePaymentStatus(
		transactionStatus || MIDTRANS_TRANSACTION_STATUS.SETTLEMENT,
		fraudStatus || MIDTRANS_FRAUD_STATUS.ACCEPT
	);
	logger.info(`Midtrans notification processed. Order: ${orderId}, Status: ${newStatus}`);
	await OrderService.updateOrderStatusByTrackingNumber(orderId, newStatus);
	return newStatus;
};

const mapWebhookError = (error: unknown) => {
	logger.error('Midtrans Webhook Error:', error as Error);
	return errorResponse(
		MESSAGES.ERROR.SERVER,
		HTTP_STATUS.INTERNAL_SERVER_ERROR,
		ERROR_CODES.INTERNAL_ERROR,
		error
	);
};

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

		const { transactionStatus, fraudStatus } = await resolveMidtransStatuses(orderId, notification);
		if (!transactionStatus) {
			return errorResponse(
				MESSAGES.ERROR.PAYMENT_STATUS_MISSING,
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		const status = await applyOrderPaymentStatus(orderId, transactionStatus, fraudStatus);
		return jsonResponse({ status }, MESSAGES.SUCCESS.NOTIFICATION_PROCESSED);
	} catch (error) {
		return mapWebhookError(error);
	}
};
