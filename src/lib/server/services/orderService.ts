import { OrderRepository } from '$lib/server/repositories/orderRepository.js';
import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { dbRepository } from '$lib/server/repositories/dbRepository.js';
import { sendStatusUpdateEmail } from '$lib/server/utils/mailer.js';

function mapOrderItems(order: any) {
	if (order.items && order.items.length > 0) {
		if (order.items.length === 1) {
			order.title = order.items[0].title;
			order.quantity = Number(order.items[0].quantity) || 0;
			order.price_at_time = Number(order.items[0].price_at_time) || 0;
		} else {
			order.title = 'Multiple Items';
			order.quantity = order.items.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0);
			order.price_at_time = 0; // The total reflects the sum
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
		// Fetch order to get user ID and tracking number
		const sql = 'SELECT user_id, tracking_number FROM orders WHERE id = ?';
		const rows = await dbRepository.query(sql, [id]) as any[];
		
		if (rows && rows.length > 0) {
			const order = rows[0];
			const user = await UserRepository.getById(order.user_id);
			if (user && user.email) {
				sendStatusUpdateEmail(user.email, status, order.tracking_number).catch((e) => {
					console.error('Failed to send status update email:', e);
				});
			}
		}
	} catch (e) {
		console.error('Failed to send status update email:', e);
	}
	
	return result;
};
