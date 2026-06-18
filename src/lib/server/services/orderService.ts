import { OrderRepository } from '$lib/server/repositories/orderRepository.js';

export const getOrders = async (userId: number) => {
	return await OrderRepository.getOrdersWithItems(userId);
};

export const getAllOrdersAdmin = async () => {
	return await OrderRepository.getAllOrders();
};
