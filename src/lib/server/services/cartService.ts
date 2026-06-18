import { CartRepository } from '$lib/server/repositories/cartRepository.js';

export const addToCart = async (userId: number, productId: number, quantity: number) => {
	await CartRepository.addToCart(userId, productId, quantity);
};

export const getCartItems = async (userId: number) => {
	return await CartRepository.getCartItems(userId);
};

export const deleteFromCart = async (userId: number, productId: number) => {
	await CartRepository.deleteFromCart(userId, productId);
};
