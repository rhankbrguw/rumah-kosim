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
	} catch {
		return null;
	}
};

export async function POST({ request }) {
	const userId = getUserIdFromAuth(request);
	if (!userId) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

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
		const reviewId = await createReview(orderId, productId, userId, rating, comment);
		return jsonResponse({ reviewId }, MESSAGES.SUCCESS.CREATE, HTTP_STATUS.CREATED);
	} catch (e) {
		const err = e as Error & { status?: number };
		if (err.status === 404 || err.status === 400) {
			return errorResponse(err.message, err.status, ERROR_CODES.INTERNAL_ERROR);
		}

		logger.error('Error in review creation:', err);
		return errorResponse(
			MESSAGES.ERROR.SERVER,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			err.message
		);
	}
}

export async function GET({ request }) {
	const userId = getUserIdFromAuth(request);
	if (!userId) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	try {
		const reviews = await getReviews(userId);
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
}
