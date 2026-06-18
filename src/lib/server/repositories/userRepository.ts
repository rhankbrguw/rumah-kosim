import type { RowDataPacket } from 'mysql2';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const UserRepository = {
	async getByUsername(username: string) {
		const sql = 'SELECT id, username, password, email, role FROM users WHERE username = ?';
		const rows = (await db.query(sql, [username])) as RowDataPacket[];
		return rows[0] || null;
	},

	async create(username: string, hashedPassword: string, email: string) {
		const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
		await db.query(sql, [username, hashedPassword, email]);
	},

	async getAddress(userId: number) {
		const rows = (await db.query('SELECT address FROM users WHERE id = ?', [userId])) as RowDataPacket[];
		return rows[0]?.address || '';
	},

	async updateAddress(userId: number, address: string) {
		await db.query('UPDATE users SET address = ? WHERE id = ?', [address, userId]);
	}
};
