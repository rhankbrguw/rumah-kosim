import type { RowDataPacket } from 'mysql2';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const ProductRepository = {
	async getAll() {
		return await db.query(`
			SELECT 
				p.id, p.title, p.price, p.image, p.description, p.quantity,
				COALESCE((SELECT SUM(quantity) FROM order_items WHERE product_id = p.id), 0) AS sold_count,
				COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = p.id), 0) AS average_rating
			FROM products p
		`);
	},

	async getById(id: number) {
		const rows = (await db.query(`
			SELECT 
				p.*,
				COALESCE((SELECT SUM(quantity) FROM order_items WHERE product_id = p.id), 0) AS sold_count,
				COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = p.id), 0) AS average_rating
			FROM products p WHERE id = ?
		`, [id])) as RowDataPacket[];
		return rows[0] || null;
	},

	async updateQuantity(id: number, quantity: number) {
		return await db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id]);
	},

	async create(title: string, price: number, image: string, description: string, quantity: number) {
		return await db.query(
			'INSERT INTO products (title, price, image, description, quantity) VALUES (?, ?, ?, ?, ?)',
			[title, price, image, description, quantity]
		);
	},

	async update(id: number, title: string, description: string, price: number, quantity: number, image: string) {
		return await db.query(
			'UPDATE products SET title = ?, description = ?, price = ?, quantity = ?, image = ? WHERE id = ?',
			[title, description, price, quantity, image, id]
		);
	},

	async updateImage(id: number, image: string) {
		return await db.query('UPDATE products SET image = ? WHERE id = ?', [image, id]);
	},

	async delete(id: number) {
		return await db.query('DELETE FROM products WHERE id = ?', [id]);
	}
};
