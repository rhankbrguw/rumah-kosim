import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { logger } from '$lib/server/utils/logger.js';

export function checkAdmin(request: Request) {
	const authHeader = request.headers.get('authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		return false;
	}

	try {
		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded?.role === 'admin';
	} catch (err) {
		logger.warn('Check admin verification failed', { error: (err as Error).message });
		return false;
	}
}
