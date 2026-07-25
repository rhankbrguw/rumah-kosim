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

export const APP_CONFIG = {
	JWT_EXPIRES_IN: '24h',
	COOKIE_MAX_AGE: 86400,
	DEFAULT_PAGINATION_LIMIT: 20,
	BCRYPT_SALT_ROUNDS: 10,
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
	ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
	MAX_SIZE_BYTES: 5 * 1024 * 1024
} as const;

export const ANIMATION = {
	TOAST_DISMISS_MS: 3000,
	REDIRECT_DELAY_MS: 1000,
	REVIEW_REDIRECT_MS: 2500
} as const;
