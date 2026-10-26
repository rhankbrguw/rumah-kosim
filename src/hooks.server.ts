import { logger } from '$lib/server/utils/logger.js';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { SECURITY } from '$lib/constants/config.js';

function applySecurityHeaders(response: Response) {
	const contentType = response.headers.get('content-type') || '';
	if (!contentType.includes('text/html')) return;

	const scriptSrc = SECURITY.MIDTRANS_SCRIPT_SOURCES.join(' ');
	const connectSrc = SECURITY.MIDTRANS_CONNECT_SOURCES.join(' ');
	const frameSrc = SECURITY.MIDTRANS_FRAME_SOURCES.join(' ');
	const imgSrc = SECURITY.MIDTRANS_IMG_SOURCES.join(' ');

	const csp = [
		`default-src 'self'`,
		`script-src ${scriptSrc}`,
		`script-src-elem ${scriptSrc}`,
		`connect-src ${connectSrc}`,
		`frame-src ${frameSrc}`,
		`img-src ${imgSrc}`,
		`style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
		`style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com`,
		`font-src 'self' https://fonts.gstatic.com data:`,
		`object-src 'none'`,
		`base-uri 'self'`
	].join('; ');

	response.headers.set('content-security-policy', csp);
	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
}

function extractAuthenticatedUser(event: Parameters<Handle>[0]['event']): App.Locals['user'] {
	const token = event.cookies.get('authToken');
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
			return decoded as App.Locals['user'];
		}
		return null;
	} catch (err) {
		logger.error('JWT Verification Error:', err as Error);
		event.cookies.delete('authToken', { path: '/' });
		return null;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const correlationId = event.request.headers.get('x-correlation-id') || crypto.randomUUID();
	event.locals.correlationId = correlationId;
	event.locals.user = extractAuthenticatedUser(event);

	const startTime = Date.now();
	logger.info('Incoming Request', {
		method: event.request.method,
		pathname: new URL(event.request.url).pathname,
		correlationId
	});

	const response = await resolve(event);
	applySecurityHeaders(response);

	logger.info('Outgoing Response', {
		status: response.status,
		durationMs: Date.now() - startTime,
		correlationId
	});

	return response;
};
