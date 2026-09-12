import { OrderRepository } from '$lib/server/repositories/orderRepository.js';
import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { ProductService } from '$lib/server/services/productService.js';
import { sendStatusUpdateEmail } from '$lib/server/utils/mailer.js';
import { logger } from '$lib/server/utils/logger.js';
import { STRINGS } from '$lib/constants/strings.js';
import {
	ORDER_STRINGS,
	TERMINAL_ORDER_STATUSES,
	ALLOWED_STATUS_TRANSITIONS
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
	if (!order.items || order.items.length === 0) {
		order.title = STRINGS.ORDER.NO_ITEMS;
		order.quantity = 0;
		order.price_at_time = 0;
		return order;
	}
	if (order.items.length === 1) {
		order.title = order.items[0].title;
		order.quantity = Number(order.items[0].quantity) || 0;
		order.price_at_time = Number(order.items[0].price_at_time) || 0;
		return order;
	}
	const count = order.items.length - 1;
	order.title = `${order.items[0].title || 'Item'} (+${count} more)`;
	order.quantity = order.items.reduce(
		(sum: number, item: OrderItemRaw) => sum + (Number(item.quantity) || 0),
		0
	);
	order.price_at_time = 0;
	return order;
}

export const getOrders = async (userId: number, page?: number, limit?: number) => {
	const offset = page !== undefined && limit !== undefined ? (page - 1) * limit : undefined;
	const result = await OrderRepository.getOrdersWithItems(userId, limit, offset);
	return { data: result.data.map(mapOrderItems), total: result.total };
};

export const getAllOrdersAdmin = async (page?: number, limit?: number) => {
	const offset = page !== undefined && limit !== undefined ? (page - 1) * limit : undefined;
	const result = await OrderRepository.getAllOrders(limit, offset);
	return { data: result.data.map(mapOrderItems), total: result.total };
};

async function dispatchStatusEmail(
	userId: number,
	status: string,
	trackingNumber: string,
	orderId?: number
) {
	try {
		const user = await UserRepository.getById(userId);
		if (!user?.email) return;
		const rawItems = orderId ? await OrderRepository.fetchAllOrderItems([orderId]) : [];
		const emailItems = rawItems.map((i) => ({
			title: i.title || STRINGS.ORDER.ITEMS,
			quantity: Number(i.quantity) || 1,
			price: Number(i.price_at_time) || 0
		}));
		await sendStatusUpdateEmail(user.email, status, trackingNumber, emailItems).catch((e) => {
			logger.error('Failed to send status update email:', e as Error);
		});
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

function validateStatusTransition(currentStatus: string, nextStatus: string) {
	if (currentStatus === ORDER_STRINGS.STATUS_PENDING) {
		throw new ConflictException(ORDER_STRINGS.ERRORS.PENDING_LOCKED);
	}
	if ((TERMINAL_ORDER_STATUSES as readonly string[]).includes(currentStatus)) {
		throw new ConflictException(ORDER_STRINGS.ERRORS.TERMINAL_STATUS);
	}
	const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
	if (!allowed.includes(nextStatus)) {
		throw new ConflictException(ORDER_STRINGS.ERRORS.INVALID_TRANSITION);
	}
}

export const updateOrderStatus = async (id: number, status: string) => {
	const currentOrder = await OrderRepository.getOrderBasicInfo(id);
	if (!currentOrder) return null;
	validateStatusTransition(currentOrder.status, status);

	if (status === ORDER_STRINGS.STATUS_CANCELLED) await restoreStockForOrder(id);
	const result = await OrderRepository.updateStatus(id, status);
	if (currentOrder.user_id) {
		await dispatchStatusEmail(
			currentOrder.user_id as number,
			status,
			currentOrder.tracking_number as string,
			id
		);
	}
	return result;
};

export const updateOrderStatusByTrackingNumber = async (trackingNumber: string, status: string) => {
	const order = (await OrderRepository.getOrderBasicInfoByTrackingNumber(trackingNumber)) as {
		id: number;
		status: string;
		user_id: number | null;
	} | null;
	if (!order || (TERMINAL_ORDER_STATUSES as readonly string[]).includes(order.status)) {
		return null;
	}
	if (status === ORDER_STRINGS.STATUS_CANCELLED) {
		await restoreStockForOrder(order.id);
	}
	const result = await OrderRepository.updateStatusByTrackingNumber(trackingNumber, status);
	if (order.user_id) {
		await dispatchStatusEmail(order.user_id as number, status, trackingNumber, order.id);
	}
	return result;
};

export { resolvePaymentStatus } from '$lib/server/utils/midtrans.js';
