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

import { sendOrderConfirmationEmail } from '$lib/server/utils/mailer.js';

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
	
	const user = await UserRepository.getById(userId);
	

	const { snap } = await import('$lib/server/utils/midtrans.js');
	const parameters = {
		transaction_details: {
			order_id: trackingNumber,
			gross_amount: Math.round(total)
		},
		customer_details: {
			first_name: user?.username || 'Customer',
			email: user?.email || 'customer@example.com'
		}
	};
	
	const transaction = await snap.createTransaction(parameters);
	const snapToken = transaction.token;

	if (user && user.email) {
		sendOrderConfirmationEmail(user.email, total, trackingNumber).catch((e) => {
			logger.error('Failed to send invoice email:', e);
		});
		

		UserRepository.getAdminEmails().then((adminEmails) => {
			if (adminEmails.length > 0) {
				import('$lib/server/utils/mailer.js').then(({ sendAdminNotificationEmail }) => {
					sendAdminNotificationEmail(adminEmails, orderId, total, user.username).catch((e) => {
						logger.error('Failed to send admin notification:', e);
					});
				});
			}
		}).catch((e) => logger.error('Failed to get admin emails:', e));
	}
	
	return { orderId, trackingNumber, snapToken };
};
