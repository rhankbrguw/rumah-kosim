import { ProductService } from '$lib/server/services/productService.js';
import { addToCart } from '$lib/server/services/cartService.js';
import { getProductReviews } from '$lib/server/services/reviewService.js';
import { fail, redirect } from '@sveltejs/kit';
import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';

export const load = async ({ params }) => {
	try {
		const productId = Number(params.id);
		const productRaw = await ProductService.getById(productId);
		const reviewsRaw = await getProductReviews(productId);
		
		const product = productRaw as unknown as {
			id: number;
			title: string;
			description: string;
			price: number;
			quantity: number;
			image: string;
			sold_count: number;
			average_rating: number;
			editorialReview?: { headline: string; body: string };
		} | null;

		const reviews = reviewsRaw as unknown as {
			id: number;
			user_name: string;
			rating: number;
			comment: string;
			created_at: string;
		}[];

		return { product, reviews };
	} catch (error) {
		logger.error('Error fetching product:', error as Error);
		return { product: null, reviews: [] };
	}
};

export const actions = {
	addToCart: async ({ request, locals }) => {
		if (!locals.user)
			return fail(401, { error: STRINGS.AUTH.LOGIN.REQUIRED, redirectTo: '/client/auth' });

		const data = await request.formData();
		const productId = Number(data.get('productId'));
		const quantity = Number(data.get('quantity'));

		try {
			await addToCart(locals.user.id, productId, quantity);
			return { success: true };
		} catch (err) {
			return fail(422, { error: (err as Error).message });
		}
	}
};
