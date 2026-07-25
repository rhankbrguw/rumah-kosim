import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { logger } from '$lib/server/utils/logger.js';
import { processProductImageUpload } from '$lib/server/services/fileUploadService.js';

export async function POST({ request }) {
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
		const err = error as Error;
		if (err.message === 'Invalid file type') {
			return errorResponse(
				'Invalid file type',
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}
		return errorResponse(
			'Error uploading file',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
