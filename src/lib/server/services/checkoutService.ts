import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { UserAddressRepository } from '$lib/server/repositories/userAddressRepository.js';
import { OrderTransactionRepository } from '$lib/server/repositories/orderTransactionRepository.js';
import { logger } from '$lib/server/utils/logger.js';

import { STORE_CONSTANTS } from '$lib/constants/config.js';

function generateTrackingNumber() {
	const prefix = STORE_CONSTANTS.ORDER_PREFIX;
	const timestamp = Date.now().toString().slice(-8);
	const random = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, '0');
	return `${prefix}${timestamp}${random}`;
}

export const getAddress = async (userId: number) => {
	return await UserAddressRepository.getAddress(userId);
};

export const updateAddress = async (userId: number, address: string) => {
	await UserAddressRepository.updateAddress(userId, address);
};

interface CartItem {
	product_id: number;
	quantity: number;
	price: number;
}

import { sendOrderConfirmationEmail } from '$lib/server/utils/mailer.js';

async function generateMidtransToken(trackingNumber: string, total: number, user: Record<string, unknown> | null) {
	const { snap } = await import('$lib/server/utils/midtrans.js');
	const transaction = await snap.createTransaction({
		transaction_details: {
			order_id: trackingNumber,
			gross_amount: Math.round(total)
		},
		customer_details: {
			first_name: user?.username || STORE_CONSTANTS.DEFAULT_CUSTOMER_NAME,
			email: user?.email || STORE_CONSTANTS.DEFAULT_CUSTOMER_EMAIL
		}
	});
	return transaction.token;
}

async function dispatchOrderEmails(user: Record<string, unknown> | null, total: number, trackingNumber: string, orderId: number) {
	if (!user?.email || typeof user.email !== 'string') return;
	const userEmail = user.email;
	const username = typeof user.username === 'string' ? user.username : STORE_CONSTANTS.DEFAULT_CUSTOMER_NAME;
	
	sendOrderConfirmationEmail(userEmail, total, trackingNumber).catch((e) => {
		logger.error('Failed to send invoice email:', e);
	});

	try {
		const adminEmails = await UserRepository.getAdminEmails();
		if (adminEmails.length > 0) {
			const { sendAdminNotificationEmail } = await import('$lib/server/utils/mailer.js');
			sendAdminNotificationEmail(adminEmails, orderId, total, username).catch((e) => {
				logger.error('Failed to send admin notification:', e);
			});
		}
	} catch (e) {
		logger.error('Failed to get admin emails:', e as Error);
	}
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
	const orderId = await OrderTransactionRepository.createOrderTransaction(
		userId,
		cartItems,
		total,
		shippingAddress,
		shippingPrice,
		shippingMethod,
		trackingNumber
	);

	const user = await UserRepository.getById(userId);
	const snapToken = await generateMidtransToken(trackingNumber, total, user);
	await dispatchOrderEmails(user, total, trackingNumber, orderId);

	return { orderId, trackingNumber, snapToken };
};
