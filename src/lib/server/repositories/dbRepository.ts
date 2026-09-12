import { query } from '$lib/db.js';

class DatabaseRepository {
	async query(text: string, params?: unknown[]) {
		return await query(text, params);
	}
}

export const dbRepository = new DatabaseRepository();
