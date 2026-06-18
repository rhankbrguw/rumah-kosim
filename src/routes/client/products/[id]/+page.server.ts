import { ProductService } from '$lib/server/services/productService.js';
import { addToCart } from '$lib/server/services/cartService.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const productRaw = await ProductService.getById(Number(params.id));
		const product = productRaw as unknown as { id: number, title: string, description: string, price: number, quantity: number, image: string, editorialReview?: { headline: string, body: string } } | null;
		return { product };
	} catch (error) {
		console.error('Error fetching product:', error);
		return { product: null };
	}
};

export const actions = {
	addToCart: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/client/login');
		
		const data = await request.formData();
		const productId = Number(data.get('productId'));
		const quantity = Number(data.get('quantity'));
		
		try {
			await addToCart(locals.user.id, productId, quantity);
			return { success: true };
		} catch (err) {
			return fail(400, { error: (err as Error).message });
		}
	}
};
