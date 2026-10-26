import type { RowDataPacket } from 'mysql2';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const ProductRepository = {
	async getAll(limit?: number, offset?: number, search?: string) {
		let sql = `
			SELECT 
				p.id, p.title, p.price, p.image, p.description, p.quantity,
				COALESCE((SELECT SUM(quantity) FROM order_items WHERE product_id = p.id), 0) AS sold_count,
				COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = p.id), 0) AS average_rating
			FROM products p
		`;
		let countSql = 'SELECT COUNT(*) as total FROM products p';
		const params: unknown[] = [];

		if (search) {
			const q = `%${search.trim().toLowerCase()}%`;
			sql += " WHERE (LOWER(p.title) LIKE ? OR LOWER(COALESCE(p.description, '')) LIKE ?)";
			countSql += " WHERE (LOWER(p.title) LIKE ? OR LOWER(COALESCE(p.description, '')) LIKE ?)";
			params.push(q, q);
		}

		sql += ' ORDER BY p.id ASC';

		if (limit !== undefined && offset !== undefined) {
			sql += ' LIMIT ? OFFSET ?';
			params.push(limit, offset);
		}

		const data = (await db.query(sql, params)) as RowDataPacket[];
		const countParams = search ? [params[0], params[1]] : [];
		const [countRow] = (await db.query(countSql, countParams)) as RowDataPacket[];

		return { data, total: countRow.total as number };
	},

	async getById(id: number) {
		const rows = (await db.query(
			`
			SELECT 
				p.*,
				COALESCE((SELECT SUM(quantity) FROM order_items WHERE product_id = p.id), 0) AS sold_count,
				COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = p.id), 0) AS average_rating
			FROM products p WHERE id = ?
		`,
			[id]
		)) as RowDataPacket[];
		return rows[0] || null;
	},

	async updateQuantity(id: number, quantity: number) {
		return await db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id]);
	},

	async increaseQuantity(id: number, quantity: number) {
		return await db.query('UPDATE products SET quantity = quantity + ? WHERE id = ?', [
			quantity,
			id
		]);
	},

	async create(title: string, price: number, image: string, description: string, quantity: number) {
		return await db.query(
			'INSERT INTO products (title, price, image, description, quantity) VALUES (?, ?, ?, ?, ?)',
			[title, price, image, description, quantity]
		);
	},

	async update(
		id: number,
		title: string,
		description: string,
		price: number,
		quantity: number,
		image: string
	) {
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
	},

	async searchAvailable(query?: string) {
		let sql = 'SELECT id, title, description, price, quantity FROM products WHERE quantity > 0';
		let params: unknown[] = [];
		if (query) {
			sql += " AND (LOWER(title) LIKE ? OR LOWER(COALESCE(description, '')) LIKE ?)";
			const q = `%${query.trim().toLowerCase()}%`;
			params = [q, q];
		}
		sql += ' LIMIT 5';
		return await db.query(sql, params);
	}
};
