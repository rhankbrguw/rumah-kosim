import { ReviewRepository } from '$lib/server/repositories/reviewRepository.js';
import { getRedisValue, setRedisValue, deleteRedisPattern } from '$lib/server/utils/redisCache.js';
import { CACHE } from '$lib/constants/config.js';

export const createReview = async (
	orderId: number,
	productId: number,
	userId: number,
	rating: number,
	comment: string
) => {
	const result = await ReviewRepository.createReviewTransaction(
		orderId,
		productId,
		userId,
		rating,
		comment
	);
	await deleteRedisPattern(`${CACHE.REDIS_REVIEW_PREFIX}${productId}*`);
	return result;
};

export const getReviews = async (userId: number) => {
	return await ReviewRepository.getReviews(userId);
};

export const getProductReviews = async (productId: number, page?: number, limit?: number) => {
	const cacheKey = `${CACHE.REDIS_REVIEW_PREFIX}${productId}:${page ?? 'all'}:${limit ?? 'all'}`;
	const cached = await getRedisValue<{ data: unknown[]; total: number }>(cacheKey);
	if (cached) return cached;

	let offset = undefined;
	if (page !== undefined && limit !== undefined) {
		offset = (page - 1) * limit;
	}
	const result = await ReviewRepository.getByProductId(productId, limit, offset);
	await setRedisValue(cacheKey, result, CACHE.REVIEWS_TTL_SECONDS);
	return result;
};
