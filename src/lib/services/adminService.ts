import { API_ROUTES } from '$lib/constants/routes';

export async function uploadImage(file: File): Promise<{ imagePath: string }> {
	const uploadData = new FormData();
	uploadData.append('image', file);

	const res = await fetch(API_ROUTES.ADMIN.UPLOAD, {
		method: 'POST',
		body: uploadData
	});

	if (!res.ok) {
		throw new Error('Upload failed');
	}

	return await res.json();
}

export async function updateProductImage(productId: number, image: string): Promise<void> {
	const res = await fetch(API_ROUTES.ADMIN.PRODUCTS, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ productId, image })
	});

	if (!res.ok) {
		throw new Error('Update failed');
	}
}
