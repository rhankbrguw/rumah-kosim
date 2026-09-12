import type { RequestHandler } from '@sveltejs/kit';

import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { logger } from '$lib/server/utils/logger.js';
import { processProductImageUpload } from '$lib/server/services/fileUploadService.js';
import { checkAdmin } from '$lib/server/admin-guard.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { STRINGS } from '$lib/constants/strings.js';
import { ValidationException } from '$lib/errors.js';

const mapUploadError = (error: unknown) => {
	logger.error('Upload error:', error as Error);
	if (error instanceof ValidationException) {
		return errorResponse(
			error.message,
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR
		);
	}
	return errorResponse(
		MESSAGES.ERROR.UPLOAD_FAILED,
		HTTP_STATUS.INTERNAL_SERVER_ERROR,
		ERROR_CODES.INTERNAL_ERROR
	);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (locals.user?.role !== 'admin' && !(await checkAdmin(request))) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	try {
		const formData = await request.formData();
		const image = formData.get('image');

		if (!(image instanceof File)) {
			return errorResponse(
				MESSAGES.ERROR.FILE_TYPE_INVALID,
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}

		const imagePath = await processProductImageUpload(image);
		return jsonResponse({ imagePath }, STRINGS.ADMIN.MESSAGES.UPLOAD_SUCCESS);
	} catch (error) {
		return mapUploadError(error);
	}
};
