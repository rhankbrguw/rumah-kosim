import type { RequestHandler } from '@sveltejs/kit';

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { createReviewSchema } from '$lib/server/validations/review.js';
import { createReview, getReviews } from '$lib/server/services/reviewService.js';

const getUserIdFromAuth = (request: Request) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.replace('Bearer ', '');
	if (!token) return null;

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded.id;
	} catch (err) {
		logger.warn('JWT verification failed in getUserIdFromAuth', { error: (err as Error).message });
		return null;
	}
};

const requireReviewUser = (request: Request) => {
	const userId = getUserIdFromAuth(request);
	return userId
		? { userId }
		: {
				error: errorResponse(
					MESSAGES.ERROR.UNAUTHORIZED,
					HTTP_STATUS.UNAUTHORIZED,
					ERROR_CODES.UNAUTHORIZED
				)
			};
};

const mapReviewCreateError = (e: unknown) => {
	const err = e as Error & { status?: number };
	if (err.status === HTTP_STATUS.NOT_FOUND || err.status === HTTP_STATUS.BAD_REQUEST) {
		const errorCode =
			err.status === HTTP_STATUS.NOT_FOUND ? ERROR_CODES.NOT_FOUND : ERROR_CODES.VALIDATION_ERROR;
		return errorResponse(err.message, err.status, errorCode);
	}
	logger.error('Error in review creation:', err);
	return errorResponse(
		MESSAGES.ERROR.SERVER,
		HTTP_STATUS.INTERNAL_SERVER_ERROR,
		ERROR_CODES.INTERNAL_ERROR,
		err.message
	);
};

export const POST: RequestHandler = async ({ request }) => {
	const auth = requireReviewUser(request);
	if (auth.error) return auth.error;

	const body = await request.json();
	const validation = createReviewSchema.safeParse(body);
	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	const { orderId, productId, rating, comment } = validation.data;
	try {
		const reviewId = await createReview(orderId, productId, auth.userId, rating, comment);
		return jsonResponse({ reviewId }, MESSAGES.SUCCESS.CREATE, HTTP_STATUS.CREATED);
	} catch (e) {
		return mapReviewCreateError(e);
	}
};

export const GET: RequestHandler = async ({ request }) => {
	const auth = requireReviewUser(request);
	if (auth.error) return auth.error;

	try {
		const reviews = await getReviews(auth.userId);
		return jsonResponse(reviews, MESSAGES.SUCCESS.FETCH);
	} catch (err) {
		logger.error('Server error:', err as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
