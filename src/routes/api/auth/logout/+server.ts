import type { RequestHandler } from '@sveltejs/kit';

import { jsonResponse } from '$lib/server/utils/response.js';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('authToken', { path: '/' });
	return jsonResponse(null, 'Logged out successfully');
};
