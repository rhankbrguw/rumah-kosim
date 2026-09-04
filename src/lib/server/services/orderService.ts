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
import { ConflictException } from '$lib/errors.js';

interface OrderItemRaw {
	title?: string;
	quantity?: number | string;
	price_at_time?: number | string;
}

interface OrderRaw {
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
			const count = order.items.length - 1;
			order.title = `${order.items[0].title || 'Item'} (+${count} more)`;
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

async function dispatchStatusEmail(userId: number, status: string, trackingNumber: string) {
	try {
		const user = await UserRepository.getById(userId);
		if (user?.email) {
			await sendStatusUpdateEmail(user.email, status, trackingNumber).catch((e) => {
				logger.error('Failed to send status update email:', e as Error);
			});
		}
	} catch (e) {
		logger.error('Failed to send status update email:', e as Error);
	}
}

async function restoreStockForOrder(orderId: number) {
	const items = await OrderRepository.fetchAllOrderItems([orderId]);
	for (const item of items) {
		await ProductService.increaseQuantity(item.product_id, item.quantity);
	}
}

export const updateOrderStatus = async (id: number, status: string) => {
	const currentOrder = await OrderRepository.getOrderBasicInfo(id);
	if (currentOrder?.status === ORDER_STRINGS.STATUS_PENDING) {
		throw new ConflictException('Pending payment orders are updated by the payment gateway.');
	}
	if (status === ORDER_STRINGS.STATUS_CANCELLED) await restoreStockForOrder(id);
	const result = await OrderRepository.updateStatus(id, status);
	const order = (await OrderRepository.getOrderBasicInfo(id)) as Record<string, unknown> | null;
	if (order?.user_id) {
		await dispatchStatusEmail(order.user_id as number, status, order.tracking_number as string);
	}
	return result;
};

export const updateOrderStatusByTrackingNumber = async (trackingNumber: string, status: string) => {
	if (status === ORDER_STRINGS.STATUS_CANCELLED) {
		const row = (await OrderRepository.getOrderBasicInfoByTrackingNumber(trackingNumber)) as {
			id: number;
		} | null;
		if (row) await restoreStockForOrder(row.id);
	}
	const result = await OrderRepository.updateStatusByTrackingNumber(trackingNumber, status);
	const order = (await OrderRepository.getOrderBasicInfoByTrackingNumber(trackingNumber)) as Record<
		string,
		unknown
	> | null;
	if (order?.user_id) await dispatchStatusEmail(order.user_id as number, status, trackingNumber);
	return result;
};

export const resolvePaymentStatus = (transactionStatus: string, fraudStatus?: string): string => {
	const s = String(transactionStatus || '').toLowerCase();
	const f = String(fraudStatus || '').toLowerCase();

	if (s === MIDTRANS_TRANSACTION_STATUS.CAPTURE || s === 'capture') {
		return f === MIDTRANS_FRAUD_STATUS.CHALLENGE
			? ORDER_STRINGS.STATUS_PROCESSING
			: ORDER_STRINGS.STATUS_PROCESSING;
	}
	if (
		s === MIDTRANS_TRANSACTION_STATUS.SETTLEMENT ||
		s === 'settlement' ||
		s === 'success' ||
		s === '200'
	) {
		return ORDER_STRINGS.STATUS_PROCESSING;
	}
	if (
		['cancel', 'deny', 'expire'].includes(s) ||
		[
			MIDTRANS_TRANSACTION_STATUS.CANCEL,
			MIDTRANS_TRANSACTION_STATUS.DENY,
			MIDTRANS_TRANSACTION_STATUS.EXPIRE
		].includes(s as 'cancel' | 'deny' | 'expire')
	) {
		return ORDER_STRINGS.STATUS_CANCELLED;
	}
	return ORDER_STRINGS.STATUS_PENDING;
};
