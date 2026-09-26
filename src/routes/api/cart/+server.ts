import type { RequestHandler } from '@sveltejs/kit';

import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { addToCartSchema, deleteFromCartSchema } from '$lib/server/validations/cart.js';
import { addToCart, getCartItems, deleteFromCart } from '$lib/server/services/cartService.js';
import type { RequestEvent } from '@sveltejs/kit';

const mapCartPostError = (err: unknown) => {
	const msg = (err as Error).message;
	if (msg.includes(STRINGS.CART.ERRORS.INSUFFICIENT_STOCK)) {
		return errorResponse(
			STRINGS.CART.ERRORS.INSUFFICIENT_STOCK,
			HTTP_STATUS.CONFLICT,
			ERROR_CODES.CONFLICT
		);
	}
	if (msg.includes(STRINGS.CART.ERRORS.CANNOT_REDUCE_BELOW_ZERO) || msg.includes('Cannot reduce')) {
		return errorResponse(
			STRINGS.CART.ERRORS.CANNOT_REDUCE_BELOW_ZERO,
			HTTP_STATUS.CONFLICT,
			ERROR_CODES.CONFLICT
		);
	}
	logger.error('Database error in POST /api/cart:', err as Error);
	return errorResponse(
		MESSAGES.ERROR.DB_CONNECTION,
		HTTP_STATUS.INTERNAL_SERVER_ERROR,
		ERROR_CODES.INTERNAL_ERROR,
		ERROR_CODES.INTERNAL_ERROR
	);
};

const mapCartDeleteError = (err: unknown) => {
	if ((err as { status?: number }).status === HTTP_STATUS.NOT_FOUND) {
		return errorResponse((err as Error).message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
	}
	logger.error('Database error in DELETE /api/cart:', err as Error);
	return errorResponse(
		MESSAGES.ERROR.DB_CONNECTION,
		HTTP_STATUS.INTERNAL_SERVER_ERROR,
		ERROR_CODES.INTERNAL_ERROR,
		ERROR_CODES.INTERNAL_ERROR
	);
};

export const POST: RequestHandler = async ({ request, locals }: RequestEvent) => {
	if (!locals.user) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	const body = await request.json();
	const validation = addToCartSchema.safeParse(body);
	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	try {
		await addToCart(locals.user.id, validation.data.productId, validation.data.quantity);
		return jsonResponse(null, MESSAGES.SUCCESS.CREATE);
	} catch (err) {
		return mapCartPostError(err);
	}
};

export const GET: RequestHandler = async ({ locals }: RequestEvent) => {
	if (!locals.user) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	try {
		const cartItems = await getCartItems(locals.user.id);
		return jsonResponse(cartItems, MESSAGES.SUCCESS.FETCH);
	} catch (err) {
		logger.error('Database error in GET /api/cart:', err as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};

export const DELETE: RequestHandler = async ({ request, locals }: RequestEvent) => {
	if (!locals.user) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	const body = await request.json();
	const validation = deleteFromCartSchema.safeParse(body);
	if (!validation.success) {
		return errorResponse(
			MESSAGES.ERROR.VALIDATION,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR,
			validation.error.format()
		);
	}

	try {
		await deleteFromCart(locals.user.id, validation.data.productId);
		return jsonResponse(null, MESSAGES.SUCCESS.DELETE);
	} catch (err) {
		return mapCartDeleteError(err);
	}
};
