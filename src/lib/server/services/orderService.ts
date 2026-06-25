import { OrderRepository } from '$lib/server/repositories/orderRepository.js';
import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { dbRepository } from '$lib/server/repositories/dbRepository.js';
import { sendStatusUpdateEmail } from '$lib/server/utils/mailer.js';

export interface OrderItemRaw {
	title?: string;
	quantity?: number | string;
	price_at_time?: number | string;
}

export interface OrderRaw {
	items?: OrderItemRaw[];
	title?: string;
	quantity?: number;
	price_at_time?: number;
	[key: string]: unknown;
}

function mapOrderItems(order: OrderRaw) {
	if (order.items && order.items.length > 0) {
		if (order.items.length === 1) {
			order.title = order.items[0].title;
			order.quantity = Number(order.items[0].quantity) || 0;
			order.price_at_time = Number(order.items[0].price_at_time) || 0;
		} else {
			order.title = 'Multiple Items';
			order.quantity = order.items.reduce((sum: number, item: OrderItemRaw) => sum + (Number(item.quantity) || 0), 0);
			order.price_at_time = 0;
		}
	} else {
		order.title = 'No Items';
		order.quantity = 0;
		order.price_at_time = 0;
	}
	return order;
}

export const getOrders = async (userId: number) => {
	const orders = await OrderRepository.getOrdersWithItems(userId);
	return orders.map(mapOrderItems);
};

export const getAllOrdersAdmin = async () => {
	const orders = await OrderRepository.getAllOrders();
	return orders.map(mapOrderItems);
};

export const updateOrderStatus = async (id: number, status: string) => {
	const result = await OrderRepository.updateStatus(id, status);
	
	try {

		const sql = 'SELECT user_id, tracking_number FROM orders WHERE id = ?';
		const rows = await dbRepository.query(sql, [id]) as any[];
		
		if (rows && rows.length > 0) {
			const order = rows[0];
			const user = await UserRepository.getById(order.user_id);
			if (user && user.email) {
				sendStatusUpdateEmail(user.email, status, order.tracking_number).catch((e) => {
					logger.error('Failed to send status update email:', e as Error);
				});
			}
		}
	} catch (e) {
		logger.error('Failed to send status update email:', e as Error);
	}
	
	return result;
};
