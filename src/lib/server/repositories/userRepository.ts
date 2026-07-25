import type { RowDataPacket } from 'mysql2';
import { pool } from '$lib/db.js';
import { dbRepository as db } from '$lib/server/repositories/dbRepository.js';
import { AUTH } from '$lib/constants/config.js';

export const UserRepository = {
	async getByUsername(username: string) {
		const sql = 'SELECT id, username, password, email, role, avatar FROM users WHERE username = ?';
		const rows = (await db.query(sql, [username])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getByEmail(email: string) {
		const sql =
			'SELECT id, username, password, email, role, is_verified, otp, otp_expires_at, reset_token, reset_expires_at, avatar FROM users WHERE email = ?';
		const rows = (await db.query(sql, [email])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getById(id: number) {
		const sql =
			'SELECT id, username, password, email, role, full_name, phone, address, avatar FROM users WHERE id = ?';
		const rows = (await db.query(sql, [id])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getByResetToken(token: string) {
		const sql =
			'SELECT id, username, password, email, role, reset_expires_at FROM users WHERE reset_token = ?';
		const rows = (await db.query(sql, [token])) as RowDataPacket[];
		return rows[0] || null;
	},

	async getAdminEmails() {
		const sql = "SELECT email FROM users WHERE role = 'admin'";
		const rows = (await db.query(sql)) as RowDataPacket[];
		return rows.map((row) => row.email);
	},

	async create(username: string, hashedPassword: string, email: string) {
		const connection = await pool.getConnection();
		await connection.beginTransaction();
		let isFirstUser = false;
		try {
			const [countRows] = await connection.query('SELECT COUNT(*) as count FROM users FOR UPDATE');
			isFirstUser = (countRows as RowDataPacket[])[0].count === 0;
			const role = isFirstUser ? 'admin' : 'user';
			const isVerified = isFirstUser ? true : false;

			const sql = `INSERT INTO users (username, password, email, role, is_verified) VALUES (?, ?, ?, ?, ?)`;
			await connection.query(sql, [username, hashedPassword, email, role, isVerified]);
			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}

		return { isFirstUser };
	},

	async setOTP(userId: number, otp: string) {
		const expiresAt = new Date(Date.now() + AUTH.OTP_EXPIRY_MS);
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

		await db.query(
			`UPDATE users SET is_verified = TRUE, otp = NULL, otp_expires_at = NULL WHERE id = ?`,
			[userId]
		);
		return true;
	},

	async setResetToken(email: string, token: string) {
		const expiresAt = new Date(Date.now() + AUTH.OTP_EXPIRY_MS);
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

		await db.query(
			`UPDATE users SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?`,
			[newHashedPassword, user.id]
		);
		return true;
	},

	async updateProfile(
		userId: number,
		data: {
			username: string;
			email: string;
			full_name: string | null;
			phone: string | null;
			address: string | null;
			avatar?: string | null;
			password?: string;
		}
	) {
		const updates = ['username = ?', 'email = ?', 'full_name = ?', 'phone = ?', 'address = ?'];
		const values: unknown[] = [data.username, data.email, data.full_name, data.phone, data.address];

		if (data.avatar !== undefined) {
			updates.push('avatar = ?');
			values.push(data.avatar);
		}
		if (data.password) {
			updates.push('password = ?');
			values.push(data.password);
		}
		
		values.push(userId);
		await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
	}
};
