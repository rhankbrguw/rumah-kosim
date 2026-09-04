import type { RequestHandler } from '@sveltejs/kit';

import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { logger } from '$lib/server/utils/logger.js';
import { processProductImageUpload } from '$lib/server/services/fileUploadService.js';
import { checkAdmin } from '$lib/server/admin-guard.js';
import { ValidationException } from '$lib/errors.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (locals.user?.role !== 'admin' && !(await checkAdmin(request))) {
		return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
	}

	try {
		const formData = await request.formData();
		const image = formData.get('image');

		if (!(image instanceof File)) {
			return errorResponse(
				'No valid image uploaded',
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		const imagePath = await processProductImageUpload(image);

		return jsonResponse({ imagePath }, 'Image uploaded successfully');
	} catch (error) {
		logger.error('Upload error:', error as Error);
		if (error instanceof ValidationException) {
			return errorResponse(
				error.message,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
			);
		}
		return errorResponse(
			'Error uploading file',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
