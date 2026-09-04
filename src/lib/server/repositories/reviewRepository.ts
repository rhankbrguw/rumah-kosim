import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '$lib/db.js';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';
import { NotFoundException, ConflictException } from '$lib/server/utils/exceptions.js';

export const ReviewRepository = {
	async checkOrderExists(
		conn: import('mysql2/promise').PoolConnection,
		orderId: number,
		userId: number
	) {
		const [orders] = (await conn.execute('SELECT id FROM orders WHERE id = ? AND user_id = ?', [
			orderId,
			userId
		])) as [RowDataPacket[], unknown];
		if (orders.length === 0) throw new NotFoundException('Order not found');
	},

	async checkReviewExists(
		conn: import('mysql2/promise').PoolConnection,
		orderId: number,
		productId: number,
		userId: number
	) {
		const [existingReviews] = (await conn.execute(
			'SELECT id FROM reviews WHERE order_id = ? AND product_id = ? AND user_id = ?',
			[orderId, productId, userId]
		)) as [RowDataPacket[], unknown];
		if (existingReviews.length > 0) throw new ConflictException('Review already exists');
	},

	async insertReview(
		conn: import('mysql2/promise').PoolConnection,
		orderId: number,
		productId: number,
		userId: number,
		rating: number,
		comment: string
	) {
		const [result] = (await conn.execute(
			`INSERT INTO reviews (order_id, product_id, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)`,
			[orderId, productId, userId, rating, comment]
		)) as [ResultSetHeader, unknown];
		return result.insertId;
	},

	async createReviewTransaction(
		orderId: number,
		productId: number,
		userId: number,
		rating: number,
		comment: string
	) {
		const conn = await pool.getConnection();

		try {
			await conn.beginTransaction();

			await this.checkOrderExists(conn, orderId, userId);
			await this.checkReviewExists(conn, orderId, productId, userId);
			const insertId = await this.insertReview(conn, orderId, productId, userId, rating, comment);

			await conn.commit();
			return insertId;
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
	},

	async getByProductId(productId: number, limit?: number, offset?: number) {
		let sql = `
            SELECT r.*, u.username as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
			ORDER BY r.id DESC`;

		const params: unknown[] = [productId];
		if (limit !== undefined && offset !== undefined) {
			sql += ' LIMIT ? OFFSET ?';
			params.push(limit, offset);
		}
		const data = (await db.query(sql, params)) as RowDataPacket[];

		const [countRow] = (await db.query(
			'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?',
			[productId]
		)) as RowDataPacket[];

		return { data, total: countRow.total as number };
	}
};
