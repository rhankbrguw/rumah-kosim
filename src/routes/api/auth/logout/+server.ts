import { jsonResponse } from '$lib/server/utils/response.js';

export async function POST({ cookies }) {
	cookies.delete('authToken', { path: '/' });
	return jsonResponse(null, 'Logged out successfully');
}
