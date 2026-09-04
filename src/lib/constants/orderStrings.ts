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
	ITEM: 'item'
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
