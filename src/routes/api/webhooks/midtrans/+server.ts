import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/utils/logger.js';
import { OrderRepository } from '$lib/server/repositories/orderRepository.js';

export const POST = async ({ request }: RequestEvent) => {
	try {
		const notification = await request.json();
		
		const orderId = notification.order_id;
		const transactionStatus = notification.transaction_status;
		const fraudStatus = notification.fraud_status;

		let newStatus = 'Pending Payment';

		if (transactionStatus == 'capture') {
			if (fraudStatus == 'challenge') {
				newStatus = 'Processing';
			} else if (fraudStatus == 'accept') {
				newStatus = 'Processing';
			}
		} else if (transactionStatus == 'settlement') {
			newStatus = 'Processing';
		} else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
			newStatus = 'Cancelled';
		} else if (transactionStatus == 'pending') {
			newStatus = 'Pending Payment';
		}

		logger.info(`Midtrans notification received. Order: ${orderId}, Status: ${newStatus}`);


		
		const { dbRepository: db } = await import('$lib/server/repositories/dbRepository.js');
		await db.query('UPDATE orders SET status = ? WHERE tracking_number = ?', [newStatus, orderId]);

		return json({ success: true, message: 'Notification processed' });
	} catch (error) {
		logger.error('Midtrans Webhook Error:', error as Error);
		return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
};
