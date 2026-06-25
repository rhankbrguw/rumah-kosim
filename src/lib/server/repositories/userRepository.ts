import type { RowDataPacket } from 'mysql2';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';

export const UserRepository = {
	async getByUsername(username: string) {
		const sql = 'SELECT id, username, password, email, role, avatar FROM users WHERE username = ?';
		const rows = (await db.query(sql, [username])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getByEmail(email: string) {
		const sql = 'SELECT id, username, password, email, role, is_verified, otp, otp_expires_at, reset_token, reset_expires_at, avatar FROM users WHERE email = ?';
		const rows = (await db.query(sql, [email])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getById(id: number) {
		const sql = 'SELECT id, username, password, email, role, full_name, phone, address, avatar FROM users WHERE id = ?';
		const rows = (await db.query(sql, [id])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getByResetToken(token: string) {
		const sql = 'SELECT id, username, password, email, role, reset_expires_at FROM users WHERE reset_token = ?';
		const rows = (await db.query(sql, [token])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getAdminEmails() {
		const sql = "SELECT email FROM users WHERE role = 'admin'";
		const rows = (await db.query(sql)) as RowDataPacket[];
		return rows.map((row) => row.email);
	},

	async create(username: string, hashedPassword: string, email: string) {
		const countRows = (await db.query('SELECT COUNT(*) as count FROM users')) as RowDataPacket[];
		const isFirstUser = countRows[0].count === 0;
		const role = isFirstUser ? 'admin' : 'user';
		const isVerified = isFirstUser ? true : false;

		const sql = `INSERT INTO users (username, password, email, role, is_verified) VALUES (?, ?, ?, ?, ?)`;
		await db.query(sql, [username, hashedPassword, email, role, isVerified]);
		
		return { isFirstUser };
	},

	async setOTP(userId: number, otp: string) {
		const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
		const sql = `UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?`;
		await db.query(sql, [otp, expiresAt, userId]);
	},

	async verifyOTP(userId: number, otp: string) {
		const sql = `SELECT otp, otp_expires_at FROM users WHERE id = ?`;
		const rows = (await db.query(sql, [userId])) as RowDataPacket[];
		const user = rows[0];

		if (!user || user.otp !== otp || new Date() > new Date(user.otp_expires_at)) {
			return false;
		}

		await db.query(`UPDATE users SET is_verified = TRUE, otp = NULL, otp_expires_at = NULL WHERE id = ?`, [userId]);
		return true;
	},

	async setResetToken(email: string, token: string) {
		const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes
		const sql = `UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE email = ?`;
		await db.query(sql, [token, expiresAt, email]);
	},

	async resetPassword(token: string, newHashedPassword: string) {
		const sql = `SELECT id, reset_expires_at FROM users WHERE reset_token = ?`;
		const rows = (await db.query(sql, [token])) as RowDataPacket[];
		const user = rows[0];

		if (!user || new Date() > new Date(user.reset_expires_at)) {
			return false;
		}

		await db.query(`UPDATE users SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?`, [newHashedPassword, user.id]);
		return true;
	},

	async getAddress(userId: number) {
		const rows = (await db.query('SELECT address FROM users WHERE id = ?', [
			userId
		])) as RowDataPacket[];
		return rows[0]?.address || '';
	},

	async updateAddress(userId: number, address: string) {
		await db.query('UPDATE users SET address = ? WHERE id = ?', [address, userId]);
	},

	async updateProfile(userId: number, data: { username: string, email: string, full_name: string | null, phone: string | null, address: string | null, avatar?: string | null, password?: string }) {
		if (data.password) {
			if (data.avatar !== undefined) {
				await db.query(
					'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, avatar = ?, password = ? WHERE id = ?',
					[data.username, data.email, data.full_name, data.phone, data.address, data.avatar, data.password, userId]
				);
			} else {
				await db.query(
					'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, password = ? WHERE id = ?',
					[data.username, data.email, data.full_name, data.phone, data.address, data.password, userId]
				);
			}
		} else {
			if (data.avatar !== undefined) {
				await db.query(
					'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, avatar = ? WHERE id = ?',
					[data.username, data.email, data.full_name, data.phone, data.address, data.avatar, userId]
				);
			} else {
				await db.query(
					'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ? WHERE id = ?',
					[data.username, data.email, data.full_name, data.phone, data.address, userId]
				);
			}
		}
	}
};
