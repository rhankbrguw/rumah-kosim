import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '$lib/db.js';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

interface CartItem {
	product_id: number;
	quantity: number;
	price: number;
}

export const OrderRepository = {
	async createOrderTransaction(
		userId: number,
		cartItems: CartItem[],
		total: number,
		shippingAddress: string,
		shippingPrice: number,
		shippingMethod: string,
		trackingNumber: string | null
	) {
		const connection = await pool.getConnection();
		await connection.beginTransaction();

		try {
			const [orderResult] = (await connection.execute(
				`INSERT INTO orders (
                    user_id, total, shipping_address, shipping_price,
                    shipping_method, tracking_number, date, status
                ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Processing')`,
				[userId, total, shippingAddress, shippingPrice, shippingMethod, trackingNumber]
			)) as [ResultSetHeader, any];

			const orderId = orderResult.insertId;

			for (const item of cartItems) {
				await connection.execute(
					'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
					[orderId, item.product_id, item.quantity, item.price]
				);
			}

			await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

			await connection.commit();

			return orderId;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	},

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

		for (let order of orders) {
			const itemsSql = `
                SELECT
                    oi.quantity, oi.price_at_time, oi.product_id,
                    p.title, p.image,
					r.id as review_id, r.comment as review_comment, r.rating as review_rating
                FROM order_items oi
                JOIN products p ON p.id = oi.product_id
				LEFT JOIN reviews r ON r.order_id = oi.order_id AND r.product_id = oi.product_id
                WHERE oi.order_id = ?`;
			const items = (await db.query(itemsSql, [order.id])) as RowDataPacket[];
			
			// Map review data into the nested structure expected by the frontend
			order.items = items.map(item => {
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

		for (let order of orders) {
			const itemsSql = `
                SELECT
                    oi.quantity, oi.price_at_time, oi.product_id,
                    p.title, p.image
                FROM order_items oi
                JOIN products p ON p.id = oi.product_id
                WHERE oi.order_id = ?`;
			const items = await db.query(itemsSql, [order.id]);
			order.items = items;
		}

		return orders;
	},

	async updateStatus(id: number, status: string) {
		await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
	}
};
