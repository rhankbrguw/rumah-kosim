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
	}
};
