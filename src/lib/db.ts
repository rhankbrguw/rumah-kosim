import mysql from 'mysql2/promise';
import { DATABASE_URL } from '$env/static/private';
import { DB_POOL_CONFIG } from '$lib/constants/config.js';

export const pool = mysql.createPool({
	uri: DATABASE_URL,
	connectionLimit: DB_POOL_CONFIG.CONNECTION_LIMIT,
	enableKeepAlive: DB_POOL_CONFIG.ENABLE_KEEP_ALIVE
});

export async function query(sql: string, params?: unknown[]) {
	const [rows] = await pool.query(sql, params);
	return rows;
}
