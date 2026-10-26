import type { RowDataPacket } from 'mysql2';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const OrderRepository = {
	async fetchOrderItemsForUserOrders(orderIds: number[]) {
		if (orderIds.length === 0) return [];
		const itemsSql = `SELECT oi.order_id, oi.quantity, oi.price_at_time, oi.product_id, p.title, p.image, r.id as review_id, r.comment as review_comment, r.rating as review_rating FROM order_items oi JOIN products p ON p.id = oi.product_id LEFT JOIN reviews r ON r.order_id = oi.order_id AND r.product_id = oi.product_id WHERE oi.order_id IN (${orderIds
			.map(() => '?')
			.join(',')})`;
		return (await db.query(itemsSql, orderIds)) as RowDataPacket[];
	},

	mapItemsToUserOrders(orders: RowDataPacket[], allItems: RowDataPacket[], username: string) {
		for (const order of orders) {
			const items = allItems.filter((item) => item.order_id === order.id);
			order.items = items.map((item) => {
				if (item.review_id)
					return {
						...item,
						reviewed: true,
						review: { comment: item.review_comment, rating: item.review_rating }
					};
				return { ...item, reviewed: false };
			});
			order.username = username;
		}
	},

	async getOrdersWithItems(userId: number, limit?: number, offset?: number) {
		const userRows = (await db.query('SELECT username FROM users WHERE id = ?', [
			userId
		])) as RowDataPacket[];
		const username = userRows[0]?.username;

		let ordersSql = `SELECT o.id, o.total, o.shipping_address, o.shipping_price, o.shipping_method, o.tracking_number, o.status, DATE_FORMAT(o.date, '%Y-%m-%d %H:%i:%s') as date FROM orders o WHERE o.user_id = ? ORDER BY o.date DESC`;
		const params: unknown[] = [userId];
		if (limit !== undefined && offset !== undefined) {
			ordersSql += ' LIMIT ? OFFSET ?';
			params.push(limit, offset);
		}

		const orders = (await db.query(ordersSql, params)) as RowDataPacket[];
		const [countRow] = (await db.query('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [
			userId
		])) as RowDataPacket[];
		const total = countRow.total as number;

		if (orders.length === 0) return { data: [], total };

		const orderIds = orders.map((o) => o.id);
		const allItems = await this.fetchOrderItemsForUserOrders(orderIds);
		this.mapItemsToUserOrders(orders, allItems, username);

		return { data: orders, total };
	},

	async fetchAllOrderItems(orderIds: number[]) {
		if (orderIds.length === 0) return [];
		const itemsSql = `SELECT oi.order_id, oi.quantity, oi.price_at_time, oi.product_id, p.title, p.image FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id IN (${orderIds
			.map(() => '?')
			.join(',')})`;
		return (await db.query(itemsSql, orderIds)) as RowDataPacket[];
	},

	async getAllOrders(limit?: number, offset?: number) {
		let ordersSql = `SELECT o.id, o.total, o.shipping_address, o.shipping_price, o.shipping_method, o.tracking_number, o.status, DATE_FORMAT(o.date, '%Y-%m-%d %H:%i:%s') as date, u.username FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.date DESC`;
		const params: unknown[] = [];
		if (limit !== undefined && offset !== undefined) {
			ordersSql += ' LIMIT ? OFFSET ?';
			params.push(limit, offset);
		}

		const orders = (await db.query(ordersSql, params)) as RowDataPacket[];
		const [countRow] = (await db.query('SELECT COUNT(*) as total FROM orders')) as RowDataPacket[];
		const total = countRow.total as number;

		if (orders.length === 0) return { data: [], total };

		const orderIds = orders.map((o) => o.id);
		const allItems = await this.fetchAllOrderItems(orderIds);

		for (const order of orders) {
			order.items = allItems.filter((item) => item.order_id === order.id);
		}

		return { data: orders, total };
	},

	async updateStatus(id: number, status: string) {
		await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
	},

	async getOrderBasicInfo(id: number) {
		const rows = (await db.query(
			'SELECT user_id, tracking_number, status FROM orders WHERE id = ?',
			[id]
		)) as RowDataPacket[];
		return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
	},

	async updateStatusByTrackingNumber(trackingNumber: string, status: string) {
		return await db.query('UPDATE orders SET status = ? WHERE tracking_number = ?', [
			status,
			trackingNumber
		]);
	},

	async getOrderBasicInfoByTrackingNumber(trackingNumber: string) {
		const rows = await db.query(
			'SELECT id, user_id, tracking_number FROM orders WHERE tracking_number = ?',
			[trackingNumber]
		);
		return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
	},

	async getPendingPayment(orderId: number, userId: number) {
		const rows = (await db.query(
			"SELECT id, user_id, payment_token, status, total, tracking_number FROM orders WHERE id = ? AND user_id = ? AND (status = 'Pending Payment' OR status = 'Pending')",
			[orderId, userId]
		)) as RowDataPacket[];
		return rows[0] || null;
	}
};
