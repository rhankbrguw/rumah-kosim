import type { RequestEvent } from '@sveltejs/kit';

import { ProductService } from '$lib/server/services/productService.js';
import { addToCart } from '$lib/server/services/cartService.js';
import { getProductReviews } from '$lib/server/services/reviewService.js';
import { fail } from '@sveltejs/kit';

import { STRINGS } from '$lib/constants/strings.js';
import { APP_CONFIG, HTTP_STATUS } from '$lib/constants/config.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';
import { logger } from '$lib/server/utils/logger.js';

interface LoadedProduct {
	id: number;
	title: string;
	description: string;
	price: number;
	quantity: number;
	image: string;
	sold_count: number;
	average_rating: number;
	editorialReview?: { headline: string; body: string };
}

interface LoadedReview {
	id: number;
	user_name: string;
	rating: number;
	comment: string;
	created_at: string;
}

const emptyProductData = (limit: number) => ({
	product: null,
	reviews: [],
	totalReviews: 0,
	reviewPage: 1,
	limit
});

export const load = async ({ params, url }: RequestEvent) => {
	const limit = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
	try {
		const productId = Number(params.id);
		const reviewPage = Number(url.searchParams.get('reviewPage')) || 1;
		const [productRaw, reviewsRaw] = await Promise.all([
			ProductService.getById(productId),
			getProductReviews(productId, reviewPage, limit)
		]);

		return {
			product: productRaw as LoadedProduct | null,
			reviews: reviewsRaw.data as LoadedReview[],
			totalReviews: reviewsRaw.total as number,
			reviewPage,
			limit
		};
	} catch (error) {
		logger.error('Error fetching product:', error as Error);
		return emptyProductData(limit);
	}
};

export const actions = {
	addToCart: async ({ request, locals }: RequestEvent) => {
		if (!locals.user)
			return fail(HTTP_STATUS.UNAUTHORIZED, {
				error: STRINGS.AUTH.LOGIN.REQUIRED,
				redirectTo: CLIENT_ROUTES.AUTH
			});

		const formData = await request.formData();
		const productId = Number(formData.get('productId'));
		const quantity = Number(formData.get('quantity'));

		try {
			await addToCart(locals.user.id, productId, quantity);
			return { success: true };
		} catch (err) {
			return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { error: (err as Error).message });
		}
	}
};
