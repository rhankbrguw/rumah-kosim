import { logger } from '$lib/server/utils/logger.js';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {

	const correlationId = event.request.headers.get('x-correlation-id') || crypto.randomUUID();
	event.locals.correlationId = correlationId;

	const startTime = Date.now();


	logger.info('Incoming Request', {
		method: event.request.method,
		pathname: new URL(event.request.url).pathname,
		correlationId
	});

	const token = event.cookies.get('authToken');
	if (token) {
		try {
			const user = jwt.verify(token, JWT_SECRET);
			event.locals.user = user;
		} catch (err) {
			logger.error('JWT Verification Error:', err as Error);
			event.cookies.delete('authToken', { path: '/' });
		}
	}

	const response = await resolve(event);

	logger.info('Outgoing Response', {
		status: response.status,
		durationMs: Date.now() - startTime,
		correlationId
	});

	return response;
};
