import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function ensureDir(dirPath: string) {
	try {
		await mkdir(dirPath, { recursive: true });
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;
	}
}

export async function processProductImageUpload(image: File): Promise<string> {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
	if (!allowedTypes.includes(image.type)) {
		throw new Error('Invalid file type');
	}

	const extension = image.name.split('.').pop();
	const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

	const uploadDir = join(process.cwd(), 'static', 'uploads', 'products');
	await ensureDir(uploadDir);

	const arrayBuffer = await image.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const filePath = join(uploadDir, filename);

	await writeFile(filePath, buffer);

	return `/uploads/products/${filename}`;
}
