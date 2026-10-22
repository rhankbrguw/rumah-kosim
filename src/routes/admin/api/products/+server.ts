import type { RequestHandler } from '@sveltejs/kit';

import { HTTP_STATUS, ERROR_CODES, APP_CONFIG } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { checkAdmin } from '$lib/server/admin-guard.js';
import { ProductService } from '$lib/server/services/productService.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import type { ResultSetHeader } from 'mysql2';
import { productCreateSchema } from '$lib/server/validations/product.js';

type ProductInput = {
	title: string;
	price: number;
	image: string;
	description: string;
	quantity: number;
};

const verifyAdmin = async (locals: App.Locals, request: Request) =>
	locals.user?.role !== 'admin' && !(await checkAdmin(request))
		? errorResponse(MESSAGES.ERROR.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED)
		: null;

export const GET: RequestHandler = async ({ request, url, locals }) => {
	const authErr = await verifyAdmin(locals, request);
	if (authErr) return authErr;

	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
		const search = url.searchParams.get('search') || undefined;
		const result = await ProductService.getAll(page, limit, search);
		return jsonResponse(result, MESSAGES.SUCCESS.PRODUCTS_FETCHED);
	} catch (error) {
		logger.error('GET products error:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.PRODUCT_FETCH_FAILED,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};

function mapDbErrorToResponse(dbError: Record<string, unknown>) {
	if (dbError.code === 'ER_DUP_ENTRY')
		return errorResponse(MESSAGES.ERROR.CONFLICT_TITLE, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
	if (dbError.code === 'ER_DATA_TOO_LONG')
		return errorResponse(
			MESSAGES.ERROR.DATA_TOO_LONG,
			HTTP_STATUS.BAD_REQUEST,
			ERROR_CODES.VALIDATION_ERROR
		);
	throw dbError;
}

const executeCreateProduct = async (data: ProductInput) => {
	try {
		const { title, price, image, description, quantity } = data;
		const result = await ProductService.create(title, price, image, description, quantity);
		return jsonResponse(
			{ productId: (result as ResultSetHeader).insertId },
			MESSAGES.SUCCESS.PRODUCT_ADDED
		);
	} catch (dbError) {
		return mapDbErrorToResponse(dbError as Record<string, unknown>);
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const authErr = await verifyAdmin(locals, request);
	if (authErr) return authErr;

	try {
		const payload = await request.json();
		const validation = productCreateSchema.safeParse(payload);

		if (!validation.success) {
			return errorResponse(
				MESSAGES.ERROR.VALIDATION,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR,
				validation.error.format()
			);
		}

		return await executeCreateProduct(validation.data);
	} catch (error) {
		logger.error('POST product error:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.PRODUCT_ADD_FAILED,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	const authErr = await verifyAdmin(locals, request);
	if (authErr) return authErr;

	try {
		const { productId, image } = await request.json();
		if (!productId || !image?.trim()) {
			return errorResponse(
				MESSAGES.VALIDATION.PRODUCT_ID_IMAGE_REQUIRED,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		await ProductService.updateImage(productId, image.trim());
		return jsonResponse(null, MESSAGES.SUCCESS.PRODUCT_IMAGE_UPDATED);
	} catch (error) {
		logger.error('PATCH product error:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.PRODUCT_IMAGE_FAILED,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const authErr = await verifyAdmin(locals, request);
	if (authErr) return authErr;

	try {
		const { productId } = await request.json();
		if (!productId) {
			return errorResponse(
				MESSAGES.VALIDATION.PRODUCT_ID_REQUIRED,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		await ProductService.delete(productId);
		return jsonResponse(null, MESSAGES.SUCCESS.PRODUCT_DELETED);
	} catch (error) {
		logger.error('DELETE product error:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.PRODUCT_DELETE_FAILED,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
