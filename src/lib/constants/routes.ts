export const API_ROUTES = {
	AUTH: {
		LOGIN: '/api/auth/login',
		LOGOUT: '/api/auth/logout',
		REGISTER: '/api/auth/register',
		VERIFY: '/api/auth/validate'
	},
	CART: '/api/cart',
	CHAT: '/api/chat',
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
	ADMIN: '/admin',
	RESET_PASSWORD: '/client/reset-password'
} as const;
