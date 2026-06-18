import mysql from 'mysql2/promise';
import { DATABASE_URL } from '$env/static/private';

export const pool = mysql.createPool({
	uri: DATABASE_URL
});

export async function query(sql: string, params?: unknown[]) {
	const [rows] = await pool.query(sql, params);
	return rows;
}
