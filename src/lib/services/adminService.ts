import { API_ROUTES } from '$lib/constants/routes';
import { MESSAGES } from '$lib/constants/messages.js';
import { InternalException } from '$lib/errors.js';

export async function uploadImage(file: File): Promise<{ imagePath: string }> {
	const uploadData = new FormData();
	uploadData.append('image', file);

	const res = await fetch(API_ROUTES.ADMIN.UPLOAD, {
		method: 'POST',
		body: uploadData
	});

	if (!res.ok) {
		const payload = await res.json();
		throw new InternalException(payload.message || MESSAGES.ERROR.UPLOAD_FAILED);
	}

	const payload = await res.json();
	if (!payload.data?.imagePath) {
		throw new InternalException(MESSAGES.ERROR.UPLOAD_FAILED);
	}
	return payload.data as { imagePath: string };
}

export async function updateProductImage(productId: number, image: string): Promise<void> {
	const res = await fetch(API_ROUTES.ADMIN.PRODUCTS, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ productId, image })
	});

	if (!res.ok) {
		const payload = await res.json();
		throw new InternalException(payload.message || MESSAGES.ERROR.UPDATE_FAILED);
	}
}
