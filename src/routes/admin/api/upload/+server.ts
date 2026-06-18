import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { HTTP_STATUS } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { join } from 'path';

async function ensureDir(dirPath: string) {
	try {
		await mkdir(dirPath, { recursive: true });
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;
	}
}

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const image = formData.get('image');

		if (!(image instanceof File)) {
			return json(
				{ success: false, message: 'No valid image uploaded' },
				{ status: HTTP_STATUS.BAD_REQUEST }
			);
		}

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!allowedTypes.includes(image.type)) {
			return json(
				{ success: false, message: 'Invalid file type' },
				{ status: HTTP_STATUS.BAD_REQUEST }
			);
		}

		// Create unique filename
		const extension = image.name.split('.').pop();
		const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

		// Ensure the upload directory exists
		const uploadDir = join(process.cwd(), 'static', 'images');
		await ensureDir(uploadDir);

		// Write the file
		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const filePath = join(uploadDir, filename);

		await writeFile(filePath, buffer);

		return json({
			success: true,
			imagePath: `/images/${filename}`
		});
	} catch (error) {
		logger.error('Upload error:', error as Error);
		return json(
			{ success: false, message: 'Error uploading file' },
			{ status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
		);
	}
}
