// Server
import type { RowDataPacket } from 'mysql2';
import { pool } from '$lib/db.js';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';
import { ConflictException, NotFoundException } from '$lib/server/utils/exceptions.js';

export const CartRepository = {
	async addToCart(userId: number, productId: number, quantity: number) {
		const connection = await pool.getConnection();
		await connection.beginTransaction();
		try {
			const [rows] = (await connection.execute(
				'SELECT quantity FROM products WHERE id = ? FOR UPDATE',
				[productId]
			)) as [RowDataPacket[], unknown];

			if (rows.length === 0) throw new NotFoundException('Product not found');
			if (rows[0].quantity < quantity) throw new ConflictException('Insufficient stock');

			await connection.execute(
				`INSERT INTO cart (user_id, product_id, quantity) 
				 VALUES (?, ?, ?) 
				 ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
				[userId, productId, quantity, quantity]
			);
			await connection.execute('UPDATE products SET quantity = quantity - ? WHERE id = ?', [
				quantity,
				productId
			]);
			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	},

	async getCartItems(userId: number) {
		const sql =
			'SELECT c.product_id, p.title, p.price, c.quantity, p.image FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?';
		return await db.query(sql, [userId]);
	},

	async getCartItemQuantity(
		connection: import('mysql2/promise').PoolConnection,
		userId: number,
		productId: number
	) {
		const [cartItem] = (await connection.execute(
			'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?',
			[userId, productId]
		)) as [RowDataPacket[], unknown];
		return cartItem.length > 0 ? cartItem[0].quantity : null;
	},

	async restoreProductQuantity(
		connection: import('mysql2/promise').PoolConnection,
		productId: number,
		quantity: number
	) {
		await connection.execute('UPDATE products SET quantity = quantity + ? WHERE id = ?', [
			quantity,
			productId
		]);
	},

	async deleteCartItem(
		connection: import('mysql2/promise').PoolConnection,
		userId: number,
		productId: number
	) {
		await connection.execute('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [
			userId,
			productId
		]);
	},

	async deleteFromCart(userId: number, productId: number) {
		const connection = await pool.getConnection();
		await connection.beginTransaction();

		try {
			const quantity = await this.getCartItemQuantity(connection, userId, productId);
			if (quantity === null) {
				throw new NotFoundException('No cart item found');
			}

			await this.restoreProductQuantity(connection, productId, quantity);
			await this.deleteCartItem(connection, userId, productId);

			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}
};
