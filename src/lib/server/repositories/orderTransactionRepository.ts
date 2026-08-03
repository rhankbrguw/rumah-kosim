import type { ResultSetHeader, FieldPacket } from 'mysql2';
import { pool } from '$lib/db.js';


interface CartItem {
	product_id: number;
	quantity: number;
	price: number;
}

export const OrderTransactionRepository = {
	async insertOrder(
		conn: import('mysql2/promise').PoolConnection,
		userId: number,
		total: number,
		shippingAddress: string,
		shippingPrice: number,
		shippingMethod: string,
		trackingNumber: string | null
	) {
		const [orderResult] = (await conn.execute(
			`INSERT INTO orders (user_id, total, shipping_address, shipping_price, shipping_method, tracking_number, date, status) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Pending Payment')`,
			[userId, total, shippingAddress, shippingPrice, shippingMethod, trackingNumber]
		)) as [ResultSetHeader, FieldPacket[]];
		return orderResult.insertId;
	},

	async processCartItems(
		conn: import('mysql2/promise').PoolConnection,
		orderId: number,
		cartItems: CartItem[]
	) {
		for (const item of cartItems) {
			// NOTE: We DO NOT deduct stock here because it is already securely
			// deducted and reserved by the `add_to_cart` stored procedure
			// when the item is added to the cart. Deducting it here would cause double-deduction.

			await conn.execute(
				'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
				[orderId, item.product_id, item.quantity, item.price]
			);
		}
	},

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
			const orderId = await this.insertOrder(
				connection,
				userId,
				total,
				shippingAddress,
				shippingPrice,
				shippingMethod,
				trackingNumber
			);
			await this.processCartItems(connection, orderId, cartItems);
			await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

			await connection.commit();
			return orderId;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}
};
