import { ProductRepository } from '$lib/server/repositories/productRepository.js';

export const ProductService = {
	getAll: async (page?: number, limit?: number, search?: string) => {
		let offset = undefined;
		if (page !== undefined && limit !== undefined) {
			offset = (page - 1) * limit;
		}
		return await ProductRepository.getAll(limit, offset, search);
	},
	getById: async (id: number) => {
		return await ProductRepository.getById(id);
	},
	updateQuantity: async (id: number, quantity: number) => {
		return await ProductRepository.updateQuantity(id, quantity);
	},
	increaseQuantity: async (id: number, quantity: number) => {
		return await ProductRepository.increaseQuantity(id, quantity);
	},
	create: async (
		title: string,
		price: number,
		image: string,
		description: string,
		quantity: number
	) => {
		return await ProductRepository.create(title, price, image, description, quantity);
	},
	update: async (
		id: number,
		title: string,
		description: string,
		price: number,
		quantity: number,
		image: string
	) => {
		return await ProductRepository.update(id, title, description, price, quantity, image);
	},
	updateImage: async (id: number, image: string) => {
		return await ProductRepository.updateImage(id, image);
	},
	delete: async (id: number) => {
		return await ProductRepository.delete(id);
	}
};
