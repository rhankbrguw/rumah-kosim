import { query } from '$lib/db.js';

export class DatabaseRepository {
	async query(text: string, params?: unknown[]) {
		return await query(text, params);
	}
}

export const dbRepository = new DatabaseRepository();
