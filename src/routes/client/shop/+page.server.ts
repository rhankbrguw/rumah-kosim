import type { RequestEvent } from '@sveltejs/kit';

import { ProductService } from '$lib/server/services/productService.js';
import { logger } from '$lib/server/utils/logger.js';

import { APP_CONFIG } from '$lib/constants/config.js';

export const load = async ({ url }: RequestEvent) => {
	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const search = url.searchParams.get('search') || undefined;
		const limit = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;

		const result = await ProductService.getAll(page, limit, search);
		const books = result.data as {
			id: number;
			title: string;
			description: string;
			price: number;
			image: string;
			sold_count: number;
			average_rating: number;
		}[];
		return { books, total: result.total, page, limit, search, success: true };
	} catch (error) {
		logger.error('Failed to load products on server:', error as Error);
		return {
			books: [],
			total: 0,
			page: 1,
			limit: APP_CONFIG.DEFAULT_PAGINATION_LIMIT,
			search: undefined,
			success: false
		};
	}
};
