import { MESSAGES } from '$lib/constants/messages.js';
import { UPLOAD } from '$lib/constants/config.js';
import { ValidationException } from '$lib/server/utils/exceptions.js';

export async function processProductImageUpload(image: File): Promise<string> {
	if (!UPLOAD.ALLOWED_TYPES.includes(image.type as (typeof UPLOAD.ALLOWED_TYPES)[number])) {
		throw new ValidationException(MESSAGES.VALIDATION.FILE_TYPE_INVALID);
	}
	if (image.size > UPLOAD.MAX_SIZE_BYTES) {
		throw new ValidationException(MESSAGES.VALIDATION.FILE_TOO_LARGE);
	}

	const arrayBuffer = await image.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	return `data:${image.type};base64,${buffer.toString('base64')}`;
}
