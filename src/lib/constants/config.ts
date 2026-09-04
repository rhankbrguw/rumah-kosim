export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500
};

export const ERROR_CODES = {
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	UNAUTHENTICATED: 'UNAUTHENTICATED',
	UNAUTHORIZED: 'UNAUTHORIZED',
	NOT_FOUND: 'NOT_FOUND',
	CONFLICT: 'CONFLICT',
	INTERNAL_ERROR: 'INTERNAL_ERROR',
	SUCCESS: 'OK'
};

export const AUTH_COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	maxAge: 60 * 60 * 24 * 7
};

export const APP_CONFIG = {
	JWT_EXPIRES_IN: '7d',
	COOKIE_MAX_AGE: 60 * 60 * 24 * 7,
	DEFAULT_PAGINATION_LIMIT: 20,
	BCRYPT_SALT_ROUNDS: 10,
	PRODUCTION_URL: 'https://rumah-kosim.rhankbrguw.xyz',
	AI_SYSTEM_INSTRUCTION: `You are an AI Customer Support Agent for Rumah Kosim Book, a premium bookstore.
Your tone must be highly professional, polite, and extremely helpful.

CRITICAL FORMATTING RULES (OCD compliance):
1. DO NOT use asterisks (**) or underscores (__) for bolding or italicizing text. Under no circumstances should you use markdown bold/italics.
2. Structure your answers logically: one opening paragraph, followed by a bulleted list ONLY if enumerating specific books or features (use standard • bullet points), and a brief closing sentence.
3. Keep paragraphs short and concise. Do not overwhelm the user with walls of text.
4. Your response will be rendered in a justified text container, so ensure your punctuation is clean.

When a user asks about book availability, use the getAvailableBooks tool. If the user asks about a specific book like "Deep Work", pass the query to the tool. Always inform the user about the stock quantity if asked.`
};

export const STORE_CONSTANTS = {
	PROMO_SHIPPING_CODE: 'XYZPROMOSHIPPING',
	SHIPPING_RATES: {
		GOSEND: 20000,
		JNE: 70000
	},
	ORDER_PREFIX: 'RK',
	DEFAULT_CUSTOMER_NAME: 'Customer',
	DEFAULT_CUSTOMER_EMAIL: 'customer@example.com'
};

export const AUTH = {
	OTP_MIN: 100000,
	OTP_RANGE: 900000,
	OTP_EXPIRY_MS: 5 * 60_000,
	RESET_TOKEN_BYTES: 32
} as const;

export const AI = {
	MODEL_NAME: 'gemini-2.5-flash',
	TEMPERATURE: 0.2
} as const;

export const SEARCH = {
	RESULT_LIMIT: 5,
	TRACKING_RANDOM_RANGE: 1000
} as const;

export const FORMAT = {
	LOCALE: 'id-ID',
	CURRENCY_CODE: 'IDR'
} as const;

export const UPLOAD = {
	ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
	MAX_SIZE_BYTES: 5 * 1024 * 1024
} as const;

export const LOCATION_LEVELS = {
	PROVINCES: 'provinces',
	REGENCIES: 'regencies',
	DISTRICTS: 'districts',
	VILLAGES: 'villages'
} as const;

export const CACHE = {
	LOCATION_TTL_SECONDS: 86_400,
	PRODUCT_LIST_TTL_SECONDS: 300,
	PRODUCT_DETAIL_TTL_SECONDS: 600,
	REVIEWS_TTL_SECONDS: 300,
	REDIS_TIMEOUT_MS: 800,
	REDIS_LOCATION_PREFIX: 'rumah-kosim:locations:',
	REDIS_PRODUCT_PREFIX: 'rumah-kosim:products:',
	REDIS_REVIEW_PREFIX: 'rumah-kosim:reviews:'
} as const;

export const ANIMATION = {
	TOAST_DURATION_MS: 3000,
	REDIRECT_DELAY_MS: 1000,
	REVIEW_REDIRECT_MS: 2500
} as const;

export const SECURITY = {
	MIDTRANS_SCRIPT_SOURCES: [
		"'self'",
		"'unsafe-inline'",
		"'unsafe-eval'",
		'https://app.sandbox.midtrans.com',
		'https://app.midtrans.com',
		'https://snap-assets.sandbox.midtrans.com',
		'https://snap-assets.midtrans.com',
		'https://api.sandbox.midtrans.com',
		'https://api.midtrans.com',
		'https://pay.google.com',
		'https://gwk.gopayapi.com',
		'https://*.gopayapi.com',
		'https://www.googletagmanager.com',
		'https://o.alicdn.com',
		'https://g.alicdn.com'
	],
	MIDTRANS_CONNECT_SOURCES: [
		"'self'",
		'https://app.sandbox.midtrans.com',
		'https://app.midtrans.com',
		'https://snap-assets.sandbox.midtrans.com',
		'https://snap-assets.midtrans.com',
		'https://api.sandbox.midtrans.com',
		'https://api.midtrans.com',
		'https://pay.google.com',
		'https://gwk.gopayapi.com',
		'https://*.gopayapi.com',
		'https://*.midtrans.com',
		'https://analytics.google.com',
		'https://stats.g.doubleclick.net',
		'https://*.grafana.net',
		'https://*.faro.grafana.net'
	],
	MIDTRANS_FRAME_SOURCES: [
		"'self'",
		'https://app.sandbox.midtrans.com',
		'https://app.midtrans.com',
		'https://api.sandbox.midtrans.com',
		'https://pay.google.com',
		'https://gwk.gopayapi.com'
	],
	MIDTRANS_IMG_SOURCES: ["'self'", 'data:', 'blob:', 'https:']
} as const;
