import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import type { RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/utils/logger.js';
import * as OrderService from '$lib/server/services/orderService.js';

export const POST = async ({ request }: RequestEvent) => {
	try {
		const notification = await request.json();
		const orderId = notification.order_id;

		const newStatus = OrderService.resolvePaymentStatus(
			notification.transaction_status,
			notification.fraud_status
		);

		logger.info(`Midtrans notification received. Order: ${orderId}, Status: ${newStatus}`);

		await OrderService.updateOrderStatusByTrackingNumber(orderId, newStatus);

		return jsonResponse(null, 'Notification processed');
	} catch (error) {
		logger.error('Midtrans Webhook Error:', error as Error);
		return errorResponse('Internal Server Error', 500, undefined, error);
	}
};
