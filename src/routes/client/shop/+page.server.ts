import { ProductService } from '$lib/server/services/productService.js';

export const load = async () => {
	try {
		const booksRaw = await ProductService.getAll();
		const books = booksRaw as unknown as { id: number, title: string, description: string, price: number, image: string }[];
		return { books, success: true };
	} catch (error) {
		console.error('Failed to load products on server:', error);
		return { books: [], success: false };
	}
};
