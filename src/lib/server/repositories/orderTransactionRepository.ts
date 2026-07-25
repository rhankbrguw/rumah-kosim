import type { ResultSetHeader, FieldPacket } from 'mysql2';
import { pool } from '$lib/db.js';

interface CartItem {
	product_id: number;
	quantity: number;
	price: number;
}

export const OrderTransactionRepository = {
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
                ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Pending Payment')`,
				[userId, total, shippingAddress, shippingPrice, shippingMethod, trackingNumber]
			)) as [ResultSetHeader, FieldPacket[]];

			const orderId = orderResult.insertId;

			for (const item of cartItems) {
				const [updateResult] = (await connection.execute(
					'UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
					[item.quantity, item.product_id, item.quantity]
				)) as [ResultSetHeader, FieldPacket[]];

				if (updateResult.affectedRows === 0) {
					throw new Error(
						`Insufficient stock for product ID ${item.product_id}. It might have just sold out.`
					);
				}

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
	}
};
