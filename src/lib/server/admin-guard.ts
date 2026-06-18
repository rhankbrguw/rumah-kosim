import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function requireAdmin(request: Request) {
	const authHeader = request.headers.get('authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		throw redirect(302, '/client/login');
	}

	try {
		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded?.role === 'admin';
	} catch {
		throw redirect(302, '/client/login');
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
	} catch {
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
