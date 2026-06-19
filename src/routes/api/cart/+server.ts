import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { addToCartSchema, deleteFromCartSchema } from '$lib/server/validations/cart.js';
import { addToCart, getCartItems, deleteFromCart } from '$lib/server/services/cartService.js';

export async function POST({ request, locals }: any) {
	if (!locals.user) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}
	const userId = locals.user.id;

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

	const { productId, quantity } = validation.data;

	try {
		await addToCart(userId, productId, quantity);
		return jsonResponse(null, MESSAGES.SUCCESS.CREATE);
	} catch (err) {
		if ((err as Error).message.includes('Insufficient stock')) {
			return errorResponse('Insufficient stock', HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
		}
		if ((err as Error).message.includes('Cannot reduce below zero')) {
			return errorResponse(
				'Cannot reduce quantity below zero',
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
	}
}

export async function GET({ locals }: any) {
	if (!locals.user) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}
	const userId = locals.user.id;

	try {
		const cartItems = await getCartItems(userId);
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
}

export async function DELETE({ request, locals }: any) {
	if (!locals.user) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}
	const userId = locals.user.id;

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

	const { productId } = validation.data;

	try {
		await deleteFromCart(userId, productId);
		return jsonResponse(null, MESSAGES.SUCCESS.DELETE);
	} catch (err) {
		if ((err as { status?: number }).status === 404) {
			return errorResponse((err as Error).message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
		}
		logger.error('Database error in DELETE /api/cart:', err as Error);
		return errorResponse(
			MESSAGES.ERROR.DB_CONNECTION,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
