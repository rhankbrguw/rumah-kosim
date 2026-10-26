export const ORDER_STRINGS = {
	STATUS_PROCESSING: 'Processing',
	STATUS_SHIPPED: 'Shipped',
	STATUS_DELIVERED: 'Delivered',
	STATUS_CANCELLED: 'Cancelled',
	STATUS_REVIEWED: 'Reviewed',
	STATUS_PENDING: 'Pending Payment',
	MULTIPLE_ITEMS: 'Multiple Items',
	NO_ITEMS: 'No Items',
	PRICE_VARIES: 'Varies',
	VIEW_DETAILS: 'View Details',
	ORDER_DETAILS: 'Order Details',
	PURCHASED_ITEMS: 'Purchased Items',
	SHIPPING_INFO: 'Shipping Information',
	CUSTOMER_NAME: 'Customer Name',
	TRACKING_NUMBER: 'Tracking Number',
	SHIPPING_ADDRESS: 'Shipping Address',
	SHIPPING_METHOD: 'Shipping Method',
	GRAND_TOTAL: 'Grand Total',
	NOT_UPDATED: 'Not updated',
	UNKNOWN_USER: 'Unknown',
	NO_ADDRESS: 'No address provided',
	REVIEWED: 'Reviewed',
	COPIES: 'copies',
	COPY: 'copy',
	ITEMS: 'items',
	ITEM: 'item',
	ERRORS: {
		PENDING_LOCKED: 'Pending payment orders are updated by the payment gateway.',
		TERMINAL_STATUS: 'Order is in a final state and cannot be modified.',
		DELIVERED_LOCKED: 'Delivered orders are final and cannot be modified.',
		CANCELLED_LOCKED: 'Cancelled orders are final and cannot be modified.',
		REVIEWED_LOCKED: 'Reviewed orders are final and cannot be modified.',
		INVALID_TRANSITION: 'Invalid order status transition.',
		NOT_DELIVERED_FOR_REVIEW: 'Only delivered orders can be reviewed.'
	}
} as const;

export const TERMINAL_ORDER_STATUSES: readonly string[] = [
	ORDER_STRINGS.STATUS_DELIVERED,
	ORDER_STRINGS.STATUS_CANCELLED,
	ORDER_STRINGS.STATUS_REVIEWED
] as const;

export const ALLOWED_STATUS_TRANSITIONS: Record<string, readonly string[]> = {
	[ORDER_STRINGS.STATUS_PENDING]: [ORDER_STRINGS.STATUS_PROCESSING, ORDER_STRINGS.STATUS_CANCELLED],
	[ORDER_STRINGS.STATUS_PROCESSING]: [ORDER_STRINGS.STATUS_SHIPPED, ORDER_STRINGS.STATUS_CANCELLED],
	[ORDER_STRINGS.STATUS_SHIPPED]: [ORDER_STRINGS.STATUS_DELIVERED, ORDER_STRINGS.STATUS_CANCELLED],
	[ORDER_STRINGS.STATUS_DELIVERED]: [ORDER_STRINGS.STATUS_REVIEWED],
	[ORDER_STRINGS.STATUS_CANCELLED]: [],
	[ORDER_STRINGS.STATUS_REVIEWED]: []
} as const;

export const MIDTRANS_TRANSACTION_STATUS = {
	CAPTURE: 'capture',
	SETTLEMENT: 'settlement',
	CANCEL: 'cancel',
	DENY: 'deny',
	EXPIRE: 'expire',
	PENDING: 'pending'
} as const;

export const MIDTRANS_FRAUD_STATUS = {
	CHALLENGE: 'challenge',
	ACCEPT: 'accept'
} as const;
