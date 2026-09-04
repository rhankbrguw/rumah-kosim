export const API_ROUTES = {
	AUTH: {
		LOGIN: '/api/auth/login',
		LOGOUT: '/api/auth/logout',
		REGISTER: '/api/auth/register',
		VERIFY: '/api/auth/validate'
	},
	CART: '/api/cart',
	ORDERS: '/api/orders',
	CHAT: '/api/chat',
	LOCATIONS: '/api/locations',
	CHECKOUT: { ADDRESS: '/api/checkout/address', PAYMENT: '/api/checkout/payment' },
	ADMIN: {
		UPLOAD: '/admin/api/upload',
		PRODUCTS: '/admin/api/products',
		ORDERS: '/admin/api/orders'
	},
	WEBHOOKS: { MIDTRANS: '/api/webhooks/midtrans' }
} as const;

export const CLIENT_ROUTES = {
	HOME: '/',
	AUTH: '/client/auth',
	SHOP: '/client/shop',
	PROFILE: '/client/profile',
	HISTORY: '/client/profile/history',
	CHECKOUT_ADDRESS: '/client/checkout/address',
	CHECKOUT_SHIPPING: '/client/checkout/shipping',
	ADMIN: '/admin',
	RESET_PASSWORD: '/client/reset-password'
} as const;

export const EXTERNAL_ROUTES = {
	MIDTRANS_SNAP_SANDBOX: 'https://app.sandbox.midtrans.com/snap/snap.js'
} as const;
