import { HTTP_STATUS, ERROR_CODES, APP_CONFIG } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { checkAdmin } from '$lib/server/admin-guard.js';
import { ProductService } from '$lib/server/services/productService.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';

import type { ResultSetHeader } from 'mysql2';
import { productCreateSchema } from '$lib/server/validations/product.js';

export async function GET({ request, url, locals }) {
	if (locals.user?.role !== 'admin' && !(await checkAdmin(request))) {
		return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
	}

	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
		const search = url.searchParams.get('search') || undefined;
		const result = await ProductService.getAll(page, limit, search);
		return jsonResponse(result, 'Products fetched successfully');
	} catch (error) {
		logger.error('GET products error:', error as Error);
		return errorResponse(
			'Error fetching products',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}

function mapDbErrorToResponse(dbError: Record<string, unknown>) {
	if (dbError.code === 'ER_DUP_ENTRY')
		return errorResponse(
			'A product with this title already exists',
			HTTP_STATUS.CONFLICT,
			ERROR_CODES.CONFLICT
		);
	if (dbError.code === 'ER_DATA_TOO_LONG')
		return errorResponse(
			'One or more fields exceed maximum length',
			HTTP_STATUS.BAD_REQUEST,
			ERROR_CODES.VALIDATION_ERROR
		);
	throw dbError;
}

export async function POST({ request, locals }) {
	if (locals.user?.role !== 'admin' && !(await checkAdmin(request))) {
		return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
	}

	try {
		const payload = await request.json();
		const validation = productCreateSchema.safeParse(payload);

		if (!validation.success) {
			return errorResponse(
				'Validation failed',
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR,
				validation.error.format()
			);
		}

		try {
			const { title, price, image, description, quantity } = validation.data;
			const result = await ProductService.create(title, price, image, description, quantity);

			return jsonResponse(
				{ productId: (result as ResultSetHeader).insertId },
				'Product added successfully'
			);
		} catch (dbError) {
			return mapDbErrorToResponse(dbError as Record<string, unknown>);
		}
	} catch (error) {
		logger.error('POST product error:', error as Error);
		return errorResponse(
			'Error adding product',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}

export async function PATCH({ request, locals }) {
	if (locals.user?.role !== 'admin' && !(await checkAdmin(request))) {
		return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
	}

	try {
		const { productId, image } = await request.json();
		if (!productId || !image?.trim()) {
			return errorResponse(
				'Product ID and image are required',
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		await ProductService.updateImage(productId, image.trim());
		return jsonResponse(null, 'Product image updated successfully');
	} catch (error) {
		logger.error('PATCH product error:', error as Error);
		return errorResponse(
			'Error updating product image',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}

export async function DELETE({ request, locals }) {
	if (locals.user?.role !== 'admin' && !(await checkAdmin(request))) {
		return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
	}

	try {
		const { productId } = await request.json();
		if (!productId) {
			return errorResponse(
				'Product ID is required',
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		await ProductService.delete(productId);
		return jsonResponse(null, 'Product deleted successfully');
	} catch (error) {
		logger.error('DELETE product error:', error as Error);
		return errorResponse(
			'Error deleting product',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
