import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '$lib/db.js';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const ReviewRepository = {
	async createReviewTransaction(orderId: number, productId: number, userId: number, rating: number, comment: string) {
		const conn = await pool.getConnection();

		try {
			await conn.beginTransaction();

			const [orders] = (await conn.execute('SELECT id FROM orders WHERE id = ? AND user_id = ?', [
				orderId,
				userId
			])) as [RowDataPacket[], any];

			if (orders.length === 0) {
				const error = new Error('Order not found') as Error & { status?: number };
				error.status = 404;
				throw error;
			}

			const [existingReviews] = (await conn.execute(
				'SELECT id FROM reviews WHERE order_id = ? AND product_id = ? AND user_id = ?',
				[orderId, productId, userId]
			)) as [RowDataPacket[], any];

			if (existingReviews.length > 0) {
				const error = new Error('Review already exists') as Error & { status?: number };
				error.status = 400;
				throw error;
			}

			const [result] = (await conn.execute(
				`INSERT INTO reviews (order_id, product_id, user_id, rating, comment)
                 VALUES (?, ?, ?, ?, ?)`,
				[orderId, productId, userId, rating, comment]
			)) as [ResultSetHeader, any];

			await conn.commit();
			return result.insertId;
		} catch (err) {
			await conn.rollback();
			throw err;
		} finally {
			conn.release();
		}
	},

	async getReviews(userId: number) {
		const sql = `
            SELECT r.*, p.title as product_title
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            WHERE r.user_id = ?`;
		return await db.query(sql, [userId]);
	}
};
