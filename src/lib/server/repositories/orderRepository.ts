import type { RowDataPacket } from 'mysql2';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const OrderRepository = {
	async getOrdersWithItems(userId: number) {
		const userRows = (await db.query('SELECT username FROM users WHERE id = ?', [
			userId
		])) as RowDataPacket[];
		const username = userRows[0]?.username;

		const ordersSql = `
            SELECT
                o.id, o.total, o.shipping_address, o.shipping_price,
                o.shipping_method, o.tracking_number, o.status,
                DATE_FORMAT(o.date, '%Y-%m-%d %H:%i:%s') as date
            FROM orders o
            WHERE o.user_id = ?
            ORDER BY o.date DESC`;
		const orders = (await db.query(ordersSql, [userId])) as RowDataPacket[];

		if (orders.length === 0) return orders;

		const orderIds = orders.map((o) => o.id);
		const itemsSql = `SELECT oi.order_id, oi.quantity, oi.price_at_time, oi.product_id, p.title, p.image, r.id as review_id, r.comment as review_comment, r.rating as review_rating FROM order_items oi JOIN products p ON p.id = oi.product_id LEFT JOIN reviews r ON r.order_id = oi.order_id AND r.product_id = oi.product_id WHERE oi.order_id IN (${orderIds
			.map(() => '?')
			.join(',')})`;
		const allItems = (await db.query(itemsSql, orderIds)) as RowDataPacket[];

		for (const order of orders) {
			const items = allItems.filter((item) => item.order_id === order.id);
			order.items = items.map((item) => {
				if (item.review_id) {
					return {
						...item,
						reviewed: true,
						review: { comment: item.review_comment, rating: item.review_rating }
					};
				}
				return { ...item, reviewed: false };
			});
			order.username = username;
		}

		return orders;
	},

	async getAllOrders() {
		const ordersSql = `
            SELECT
                o.id, o.total, o.shipping_address, o.shipping_price,
                o.shipping_method, o.tracking_number, o.status,
                DATE_FORMAT(o.date, '%Y-%m-%d %H:%i:%s') as date,
				u.username
            FROM orders o
			JOIN users u ON u.id = o.user_id
            ORDER BY o.date DESC`;
		const orders = (await db.query(ordersSql)) as RowDataPacket[];

		if (orders.length === 0) return orders;

		const orderIds = orders.map((o) => o.id);
		const itemsSql = `
			SELECT
				oi.order_id, oi.quantity, oi.price_at_time, oi.product_id,
				p.title, p.image
			FROM order_items oi
			JOIN products p ON p.id = oi.product_id
			WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})`;

		const allItems = (await db.query(itemsSql, orderIds)) as RowDataPacket[];

		for (const order of orders) {
			order.items = allItems.filter((item) => item.order_id === order.id);
		}

		return orders;
	},

	async updateStatus(id: number, status: string) {
		await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
	},

	async getOrderBasicInfo(id: number) {
		const rows = await db.query('SELECT user_id, tracking_number FROM orders WHERE id = ?', [id]);
		return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
	},

	async updateStatusByTrackingNumber(trackingNumber: string, status: string) {
		return await db.query('UPDATE orders SET status = ? WHERE tracking_number = ?', [
			status,
			trackingNumber
		]);
	}
};
