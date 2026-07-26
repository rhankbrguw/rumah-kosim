import { ProductService } from '$lib/server/services/productService.js';
import { addToCart } from '$lib/server/services/cartService.js';
import { getProductReviews } from '$lib/server/services/reviewService.js';
import { fail } from '@sveltejs/kit';
import { STRINGS } from '$lib/constants/strings.js';
import { APP_CONFIG } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';

export const load = async ({ params, url }) => {
	try {
		const productId = Number(params.id);
		const reviewPage = Number(url.searchParams.get('reviewPage')) || 1;
		const limit = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
		const productRaw = await ProductService.getById(productId);
		const reviewsRaw = await getProductReviews(productId, reviewPage, limit);

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

		const reviews = reviewsRaw.data as unknown as {
			id: number;
			user_name: string;
			rating: number;
			comment: string;
			created_at: string;
		}[];
		
		const totalReviews = reviewsRaw.total as number;

		return { product, reviews, totalReviews, reviewPage, limit };
	} catch (error) {
		logger.error('Error fetching product:', error as Error);
		return { product: null, reviews: [], totalReviews: 0, reviewPage: 1, limit: 20 };
	}
};

export const actions = {
	addToCart: async ({ request, locals }) => {
		if (!locals.user)
			return fail(401, { error: STRINGS.AUTH.LOGIN.REQUIRED, redirectTo: '/client/auth' });

		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		const quantity = Number(formData.get('quantity'));

		try {
			await addToCart(locals.user.id, productId, quantity);
			return { success: true };
		} catch (err) {
			return fail(422, { error: (err as Error).message });
		}
	}
};
