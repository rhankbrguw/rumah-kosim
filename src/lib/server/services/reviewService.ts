import { ReviewRepository } from '$lib/server/repositories/reviewRepository.js';

export const createReview = async (
	orderId: number,
	productId: number,
	userId: number,
	rating: number,
	comment: string
) => {
	return await ReviewRepository.createReviewTransaction(
		orderId,
		productId,
		userId,
		rating,
		comment
	);
};

export const getReviews = async (userId: number) => {
	return await ReviewRepository.getReviews(userId);
};

export const getProductReviews = async (productId: number, page?: number, limit?: number) => {
	let offset = undefined;
	if (page !== undefined && limit !== undefined) {
		offset = (page - 1) * limit;
	}
	return await ReviewRepository.getByProductId(productId, limit, offset);
};
