import { OrderRepository } from '$lib/server/repositories/orderRepository.js';
import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { ProductService } from '$lib/server/services/productService.js';
import { sendStatusUpdateEmail } from '$lib/server/utils/mailer.js';
import { logger } from '$lib/server/utils/logger.js';
import { STRINGS } from '$lib/constants/strings.js';
import {
	MIDTRANS_TRANSACTION_STATUS,
	MIDTRANS_FRAUD_STATUS,
	ORDER_STRINGS
} from '$lib/constants/orderStrings.js';

export interface OrderItemRaw {
	title?: string;
	quantity?: number | string;
	price_at_time?: number | string;
}

export interface OrderRaw {
	items?: OrderItemRaw[];
	title?: string;
	quantity?: number;
	price_at_time?: number;
	[key: string]: unknown;
}

function mapOrderItems(order: OrderRaw) {
	if (order.items && order.items.length > 0) {
		if (order.items.length === 1) {
			order.title = order.items[0].title;
			order.quantity = Number(order.items[0].quantity) || 0;
			order.price_at_time = Number(order.items[0].price_at_time) || 0;
		} else {
			order.title = STRINGS.ORDER.MULTIPLE_ITEMS;
			order.quantity = order.items.reduce(
				(sum: number, item: OrderItemRaw) => sum + (Number(item.quantity) || 0),
				0
			);
			order.price_at_time = 0;
		}
	} else {
		order.title = STRINGS.ORDER.NO_ITEMS;
		order.quantity = 0;
		order.price_at_time = 0;
	}
	return order;
}

export const getOrders = async (userId: number, page?: number, limit?: number) => {
	let offset = undefined;
	if (page !== undefined && limit !== undefined) {
		offset = (page - 1) * limit;
	}
	const result = await OrderRepository.getOrdersWithItems(userId, limit, offset);
	return { data: result.data.map(mapOrderItems), total: result.total };
};

export const getAllOrdersAdmin = async (page?: number, limit?: number) => {
	let offset = undefined;
	if (page !== undefined && limit !== undefined) {
		offset = (page - 1) * limit;
	}
	const result = await OrderRepository.getAllOrders(limit, offset);
	return { data: result.data.map(mapOrderItems), total: result.total };
};

export const updateOrderStatus = async (id: number, status: string) => {
	// If changing to Cancelled, we should restore stock
	if (status === ORDER_STRINGS.STATUS_CANCELLED) {
		const items = await OrderRepository.fetchAllOrderItems([id]);
		for (const item of items) {
			await ProductService.increaseQuantity(item.product_id, item.quantity);
		}
	}
	const result = await OrderRepository.updateStatus(id, status);

	try {
		const order = (await OrderRepository.getOrderBasicInfo(id)) as Record<string, unknown>;

		if (order) {
			const user = await UserRepository.getById(order.user_id as number);
			if (user && user.email) {
				sendStatusUpdateEmail(user.email as string, status, order.tracking_number as string).catch(
					(e) => {
						logger.error('Failed to send status update email:', e as Error);
					}
				);
			}
		}
	} catch (e) {
		logger.error('Failed to send status update email:', e as Error);
	}

	return result;
};

export const updateOrderStatusByTrackingNumber = async (trackingNumber: string, status: string) => {
	// If changing to Cancelled, we should restore stock
	if (status === ORDER_STRINGS.STATUS_CANCELLED) {
		const orderRow = (await OrderRepository.getOrderBasicInfoByTrackingNumber(trackingNumber)) as {
			id: number;
		} | null;
		if (orderRow) {
			const items = await OrderRepository.fetchAllOrderItems([orderRow.id]);
			for (const item of items) {
				await ProductService.increaseQuantity(item.product_id, item.quantity);
			}
		}
	}
	const result = await OrderRepository.updateStatusByTrackingNumber(trackingNumber, status);
	return result;
};

export const resolvePaymentStatus = (transactionStatus: string, fraudStatus: string): string => {
	let newStatus: string = ORDER_STRINGS.STATUS_PENDING;

	if (transactionStatus == MIDTRANS_TRANSACTION_STATUS.CAPTURE) {
		if (fraudStatus == MIDTRANS_FRAUD_STATUS.CHALLENGE) {
			newStatus = ORDER_STRINGS.STATUS_PROCESSING;
		} else if (fraudStatus == MIDTRANS_FRAUD_STATUS.ACCEPT) {
			newStatus = ORDER_STRINGS.STATUS_PROCESSING;
		}
	} else if (transactionStatus == MIDTRANS_TRANSACTION_STATUS.SETTLEMENT) {
		newStatus = ORDER_STRINGS.STATUS_PROCESSING;
	} else if (
		transactionStatus == MIDTRANS_TRANSACTION_STATUS.CANCEL ||
		transactionStatus == MIDTRANS_TRANSACTION_STATUS.DENY ||
		transactionStatus == MIDTRANS_TRANSACTION_STATUS.EXPIRE
	) {
		newStatus = ORDER_STRINGS.STATUS_CANCELLED;
	} else if (transactionStatus == MIDTRANS_TRANSACTION_STATUS.PENDING) {
		newStatus = ORDER_STRINGS.STATUS_PENDING;
	}
	return newStatus;
};
