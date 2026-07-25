import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/utils/logger.js';

export function requireAdmin(request: Request) {
	const authHeader = request.headers.get('authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		throw redirect(302, '/client/auth');
	}

	try {
		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded?.role === 'admin';
	} catch (err) {
		logger.warn('Admin guard verification failed', { error: (err as Error).message });
		throw redirect(302, '/client/auth');
	}
}

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

export function handleAdminRoute(event: RequestEvent) {
	if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
		const isAdmin = requireAdmin(event.request);
		if (!isAdmin) {
			throw redirect(302, '/admin/login');
		}
	}
}
