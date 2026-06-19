import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { checkAdmin } from '$lib/server/admin-guard.js';
import { ProductService } from '$lib/server/services/productService.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { productCreateSchema } from '$lib/server/validations/product.js';
import { z } from 'zod';
import type { ResultSetHeader } from 'mysql2';

export async function GET({ request }) {
	if (!(await checkAdmin(request))) {
		return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
	}

	try {
		const products = await ProductService.getAll();
		return jsonResponse({ products }, 'Products fetched successfully');
	} catch (error) {
		logger.error('GET products error:', error as Error);
		return errorResponse(
			'Error fetching products',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}

// Helper schema that coerces strings to numbers since formData/json might send strings
const adminProductSchema = z.object({
	title: z.string().min(1, 'Title is required').trim(),
	price: z.coerce.number().positive('Valid price is required'),
	image: z.string().min(1, 'Image is required').trim(),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description must be less than 255 characters')
		.trim(),
	quantity: z.coerce.number().int().min(0, 'Valid quantity is required')
});

export async function POST({ request }) {
	if (!(await checkAdmin(request))) {
		return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
	}

	try {
		const data = await request.json();
		const validation = adminProductSchema.safeParse(data);

		if (!validation.success) {
			const firstError = Object.values(validation.error.flatten().fieldErrors)[0][0];
			return errorResponse(
				firstError,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
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
			if ((dbError as { code?: string }).code === 'ER_DUP_ENTRY') {
				return errorResponse(
					'A product with this title already exists',
					HTTP_STATUS.CONFLICT,
					ERROR_CODES.CONFLICT
				);
			}
			if ((dbError as { code?: string }).code === 'ER_DATA_TOO_LONG') {
				return errorResponse(
					'One or more fields exceed maximum length',
					HTTP_STATUS.BAD_REQUEST,
					ERROR_CODES.VALIDATION_ERROR
				);
			}
			throw dbError;
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

export async function PATCH({ request }) {
	if (!(await checkAdmin(request))) {
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

export async function DELETE({ request }) {
	if (!(await checkAdmin(request))) {
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
