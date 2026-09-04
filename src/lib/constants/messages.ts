export const MESSAGES = {
	SUCCESS: {
		FETCH: 'Data retrieved successfully',
		CREATE: 'Created successfully',
		UPDATE: 'Updated successfully',
		DELETE: 'Deleted successfully',
		AUTH: 'Authenticated successfully',
		PENDING_PAYMENT_RETRIEVED: 'Pending payment retrieved successfully'
	},
	ERROR: {
		SERVER: 'Internal Server Error',
		NOT_FOUND: 'Resource not found',
		UNAUTHORIZED: 'Unauthorized access',
		FORBIDDEN: 'Forbidden access',
		VALIDATION: 'Validation failed',
		DB_CONNECTION: 'Database connection error',
		UPLOAD_FAILED: 'Upload failed',
		UPDATE_FAILED: 'Update failed',
		FETCH_CART_FAILED: 'Failed to fetch cart',
		PENDING_PAYMENT_NOT_FOUND: 'Pending payment not found',
		PAYMENT_VERIFICATION_FAILED: 'Payment status verification failed',
		PAYMENT_STATUS_MISSING: 'Payment status is missing',
		CHAT_REQUEST_FAILED: 'Failed to send message',
		FILE_TYPE_INVALID: 'Invalid file type'
	},
	VALIDATION: {
		USERNAME_REQUIRED: 'Username is required',
		USERNAME_FORMAT:
			'Username must be 3-30 characters (letters, numbers, underscores, dashes, dots)',
		PASSWORD_REQUIRED: 'Password is required',
		PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
		EMAIL_INVALID: 'Please enter a valid email address',
		EMAIL_FORMAT: 'Please enter a valid email format (e.g. name@gmail.com)',
		EMAIL_PROVIDER_INVALID:
			'Please use a valid official email provider (e.g. Gmail, Outlook, Yahoo, iCloud, Proton, Zoho)',
		FULL_NAME_INVALID: 'Full name must only contain letters, spaces, and punctuation (no numbers)',
		FULL_NAME_MIN_LENGTH: 'Full name must be at least 2 characters',
		PHONE_INVALID: 'Phone number must only contain digits (8-15 digits)',
		CONFIRM_PASSWORD_MISMATCH: "Passwords don't match",
		TOKEN_REQUIRED: 'Token is required',
		CART_ITEMS_REQUIRED: 'Cart items cannot be empty',
		TOTAL_POSITIVE: 'Total must be greater than zero',
		SHIPPING_ADDRESS_REQUIRED: 'Shipping address is required',
		SHIPPING_PRICE_MIN: 'Shipping price cannot be negative',
		SHIPPING_METHOD_REQUIRED: 'Shipping method is required',
		CART_EMPTY: 'Your cart is empty or the order has already been processed.',
		FILE_TYPE_INVALID: 'Use a JPG, PNG, GIF, or WEBP image.',
		FILE_TOO_LARGE: 'Image must be 5 MB or smaller.',
		ORDER_ID_INVALID: 'Order id is invalid',
		MIDTRANS_ORDER_ID_REQUIRED: 'Midtrans order id is required'
	}
} as const;
