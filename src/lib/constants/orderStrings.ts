export const ORDER_STRINGS = {
	STATUS_PROCESSING: 'Processing',
	STATUS_SHIPPED: 'Shipped',
	STATUS_DELIVERED: 'Delivered',
	STATUS_CANCELLED: 'Cancelled',
	STATUS_REVIEWED: 'Reviewed',
	STATUS_PENDING: 'Pending Payment',
	MULTIPLE_ITEMS: 'Multiple Items',
	NO_ITEMS: 'No Items'
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
