import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { OrderRepository } from '$lib/server/repositories/orderRepository.js';

function generateTrackingNumber() {
	const prefix = 'RK';
	const timestamp = Date.now().toString().slice(-8);
	const random = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, '0');
	return `${prefix}${timestamp}${random}`;
}

export const getAddress = async (userId: number) => {
	return await UserRepository.getAddress(userId);
};

export const updateAddress = async (userId: number, address: string) => {
	await UserRepository.updateAddress(userId, address);
};

interface CartItem {
	product_id: number;
	quantity: number;
	price: number;
}

export const processPayment = async (
	userId: number,
	cartItems: CartItem[],
	total: number,
	shippingAddress: string,
	shippingPrice: number,
	shippingMethod: string
) => {
	const trackingNumber = generateTrackingNumber();
	const orderId = await OrderRepository.createOrderTransaction(
		userId,
		cartItems,
		total,
		shippingAddress,
		shippingPrice,
		shippingMethod,
		trackingNumber
	);
	return { orderId, trackingNumber };
};
