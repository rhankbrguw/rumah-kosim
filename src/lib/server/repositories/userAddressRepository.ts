import type { RowDataPacket } from 'mysql2';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const UserAddressRepository = {
	async getAddress(userId: number) {
		const rows = (await db.query('SELECT address FROM users WHERE id = ?', [
			userId
		])) as RowDataPacket[];
		return rows[0]?.address || '';
	},

	async updateAddress(userId: number, address: string) {
		await db.query('UPDATE users SET address = ? WHERE id = ?', [address, userId]);
	},

	async getUserAddresses(userId: number) {
		const sql =
			'SELECT id, label, address_text, is_primary FROM user_addresses WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC';
		const rows = (await db.query(sql, [userId])) as RowDataPacket[];
		return rows;
	},

	async saveUserAddress(
		userId: number,
		label: string,
		addressText: string,
		isPrimary: boolean = false
	) {
		if (isPrimary) {
			await db.query('UPDATE user_addresses SET is_primary = FALSE WHERE user_id = ?', [userId]);
		}
		const sql =
			'INSERT INTO user_addresses (user_id, label, address_text, is_primary) VALUES (?, ?, ?, ?)';
		await db.query(sql, [userId, label, addressText, isPrimary]);
	},

	async deleteUserAddress(id: number, userId: number) {
		const sql = 'DELETE FROM user_addresses WHERE id = ? AND user_id = ?';
		await db.query(sql, [id, userId]);
	}
};
