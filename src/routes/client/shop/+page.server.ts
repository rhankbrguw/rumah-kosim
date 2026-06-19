import { ProductService } from '$lib/server/services/productService.js';
import { logger } from '$lib/server/utils/logger.js';

export const load = async () => {
	try {
		const booksRaw = await ProductService.getAll();
		const books = booksRaw as unknown as {
			id: number;
			title: string;
			description: string;
			price: number;
			image: string;
			sold_count: number;
			average_rating: number;
		}[];
		return { books, success: true };
	} catch (error) {
		logger.error('Failed to load products on server:', error as Error);
		return { books: [], success: false };
	}
};
