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
	ABOUT: '/client/about',
	SHOP: '/client/shop',
	CART: '/client/cart',
	PROFILE: '/client/profile',
	HISTORY: '/client/profile/history',
	CHECKOUT_ADDRESS: '/client/checkout/address',
	CHECKOUT_SHIPPING: '/client/checkout/shipping',
	CHECKOUT_PAYMENT: '/client/checkout/payment',
	ADMIN: '/admin',
	RESET_PASSWORD: '/client/reset-password',
	PRODUCT_DETAIL: (id: number | string) => `/client/products/${id}`
} as const;

export const EXTERNAL_ROUTES = {
	MIDTRANS_SNAP_SANDBOX: 'https://app.sandbox.midtrans.com/snap/snap.js',
	MIDTRANS_SNAP_PRODUCTION: 'https://app.midtrans.com/snap/snap.js'
} as const;
