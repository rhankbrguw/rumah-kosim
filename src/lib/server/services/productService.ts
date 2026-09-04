import { ProductRepository } from '$lib/server/repositories/productRepository.js';
import { getRedisValue, setRedisValue, deleteRedisPattern } from '$lib/server/utils/redisCache.js';
import { CACHE } from '$lib/constants/config.js';

async function invalidateProductCache() {
	await deleteRedisPattern(`${CACHE.REDIS_PRODUCT_PREFIX}*`);
}

export const ProductService = {
	getAll: async (page?: number, limit?: number, search?: string) => {
		const cacheKey = `${CACHE.REDIS_PRODUCT_PREFIX}list:${page ?? 'all'}:${limit ?? 'all'}:${
			search ?? ''
		}`;
		const cached = await getRedisValue<{ data: unknown[]; total: number }>(cacheKey);
		if (cached) return cached;

		let offset = undefined;
		if (page !== undefined && limit !== undefined) {
			offset = (page - 1) * limit;
		}
		const result = await ProductRepository.getAll(limit, offset, search);
		await setRedisValue(cacheKey, result, CACHE.PRODUCT_LIST_TTL_SECONDS);
		return result;
	},
	getById: async (id: number) => {
		const cacheKey = `${CACHE.REDIS_PRODUCT_PREFIX}detail:${id}`;
		const cached = await getRedisValue<Record<string, unknown>>(cacheKey);
		if (cached) return cached;

		const result = await ProductRepository.getById(id);
		if (result) {
			await setRedisValue(cacheKey, result, CACHE.PRODUCT_DETAIL_TTL_SECONDS);
		}
		return result;
	},
	updateQuantity: async (id: number, quantity: number) => {
		const result = await ProductRepository.updateQuantity(id, quantity);
		await invalidateProductCache();
		return result;
	},
	increaseQuantity: async (id: number, quantity: number) => {
		const result = await ProductRepository.increaseQuantity(id, quantity);
		await invalidateProductCache();
		return result;
	},
	create: async (
		title: string,
		price: number,
		image: string,
		description: string,
		quantity: number
	) => {
		const result = await ProductRepository.create(title, price, image, description, quantity);
		await invalidateProductCache();
		return result;
	},
	update: async (
		id: number,
		title: string,
		description: string,
		price: number,
		quantity: number,
		image: string
	) => {
		const result = await ProductRepository.update(id, title, description, price, quantity, image);
		await invalidateProductCache();
		return result;
	},
	updateImage: async (id: number, image: string) => {
		const result = await ProductRepository.updateImage(id, image);
		await invalidateProductCache();
		return result;
	},
	delete: async (id: number) => {
		const result = await ProductRepository.delete(id);
		await invalidateProductCache();
		return result;
	}
};
