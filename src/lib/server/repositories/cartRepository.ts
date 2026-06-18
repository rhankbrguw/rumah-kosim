import type { RowDataPacket } from 'mysql2';
import { pool } from '$lib/db.js';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const CartRepository = {
	async addToCart(userId: number, productId: number, quantity: number) {
		await db.query('CALL add_to_cart(?, ?, ?)', [userId, productId, quantity]);
	},

	async getCartItems(userId: number) {
		const sql =
			'SELECT c.product_id, p.title, p.price, c.quantity, p.image FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?';
		return await db.query(sql, [userId]);
	},

	async deleteFromCart(userId: number, productId: number) {
		const connection = await pool.getConnection();
		await connection.beginTransaction();

		try {
			const [cartItem] = (await connection.execute(
				'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
				[userId, productId]
			)) as [RowDataPacket[], any];

			if (cartItem.length === 0) {
				const error = new Error('No cart item found') as Error & { status?: number };
				error.status = 404;
				throw error;
			}

			await connection.execute('UPDATE products SET quantity = quantity + ? WHERE id = ?', [
				cartItem[0].quantity,
				productId
			]);

			await connection.execute('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [
				userId,
				productId
			]);

			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}
};
