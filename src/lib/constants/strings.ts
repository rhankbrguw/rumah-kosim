import { ADMIN_STRINGS } from './adminStrings';

export const STRINGS = {
	ADMIN: ADMIN_STRINGS,
	SHOP: {
		SEARCH_PLACEHOLDER: 'Search books...',
		SHOW_MORE: 'Details',
		SHOW_MORE_MOBILE: 'Details',
		FALLBACK_IMAGE: '/images/placeholder.jpg'
	},
	AUTH: {
		LOGIN: {
			TITLE: 'Login',
			SUBTITLE: 'Welcome back to Rumah Kosim',
			REQUIRED: 'Authentication required. Please login to continue.',
			EMAIL_LABEL: 'Email address',
			EMAIL_PLACEHOLDER: 'Enter your email',
			PASSWORD_LABEL: 'Password',
			PASSWORD_PLACEHOLDER: '••••••••',
			SUBMIT: 'Login',
			NO_ACCOUNT: "Don't have an account?",
			SIGNUP_LINK: 'Sign up here'
		},
		SIGNUP: {
			TITLE: 'Register',
			SUBTITLE: 'Join Rumah Kosim today',
			USERNAME_LABEL: 'Username',
			USERNAME_PLACEHOLDER: 'Choose a username',
			EMAIL_LABEL: 'Email address',
			EMAIL_PLACEHOLDER: 'Enter your email',
			PASSWORD_LABEL: 'Password',
			PASSWORD_PLACEHOLDER: '••••••••',
			CONFIRM_PASSWORD_LABEL: 'Confirm Password',
			SUBMIT: 'Sign Up',
			HAS_ACCOUNT: 'Already have an account?',
			LOGIN_LINK: 'Sign in here'
		},
		MESSAGES: {
			INVALID_CREDENTIALS: 'Invalid username or password',
			DB_ERROR_LOGIN: 'Database error during login',
			CONFLICT_USER: 'Username or email already exists',
			DB_ERROR_REGISTER: 'Database error during registration'
		},
		OTP: {
			TITLE: 'Verify Account',
			SUBTITLE: 'Enter the code sent to your email',
			LABEL: 'Enter 6-digit OTP',
			DESC: 'An OTP has been sent to your email.',
			PLACEHOLDER: '------',
			SUBMIT: 'Verify Account'
		},
		FORGOT_PASSWORD: {
			TITLE: 'Reset Password',
			SUBTITLE: 'We will send you a secure reset link',
			LABEL: 'Registered Email',
			DESC: 'Enter your email and we will send you a link to reset your password.',
			PLACEHOLDER: 'you@example.com',
			SUBMIT: 'Send Reset Link',
			BACK: 'Back to Login',
			LINK: 'Forgot Password?'
		}
	},
	EMAIL: {
		INVOICE: {
			TITLE: 'Order Confirmation',
			SUBJECT: 'Your Rumah-Kosim Invoice',
			GREETING: 'Thank you for your order!',
			MESSAGE: 'Your order has been received and is currently being processed. Here are the details:',
			TOTAL: 'Total:',
			SHIPPING_ADDRESS: 'Shipping Address:',
			TRACKING: 'Tracking Number:',
			BUTTON: 'View Order History'
		},
		SHIPPING: {
			TITLE: 'Shipping Update',
			SUBJECT: 'Your order status has been updated',
			GREETING: 'Good news about your order!',
			MESSAGE: 'Your order status has been updated to:',
			TRACKING: 'Your tracking number is:',
			BUTTON: 'Track Order'
		},
		ADMIN: {
			TITLE: 'New Order Received',
			SUBJECT: 'New Order Alert - Rumah Kosim',
			MESSAGE: 'A new order has been placed by',
			BUTTON: 'View Order Dashboard'
		}
	},
	CART: {
		TITLE: 'Shopping Cart',
		EMPTY: 'Your cart is empty',
		TOTAL: 'Total',
		CHECKOUT: 'Proceed to Checkout',
		REMOVE: 'Remove item'
	},
	CHECKOUT: {
		TITLE: 'Checkout',
		STEPS: {
			ADDRESS: 'Address',
			SHIPPING: 'Shipping',
			PAYMENT: 'Payment'
		},
		ADDRESS: {
			TITLE: 'Shipping Address',
			FIRST_NAME: 'First Name',
			LAST_NAME: 'Last Name',
			ADDRESS: 'Address',
			APARTMENT: 'Apartment, suite, etc. (optional)',
			CITY: 'City',
			POSTAL: 'Postal Code',
			PHONE: 'Phone',
			CONTINUE: 'Continue to Shipping',
			COUPON_PLACEHOLDER: 'Enter coupon code here'
		},
		SHIPPING: {
			CONTINUE: 'Continue to Payment',
			COUPON_APPLY: 'Apply',
			COUPON_SUCCESS: 'Free shipping coupon applied!'
		},
		PAYMENT: {
			TITLE: 'Payment Details',
			CARD_NAME: 'Name on Card',
			CARD_NUMBER: 'Card Number',
			EXPIRY: 'Expiry Date',
			CVV: 'CVV',
			CVV_PLACEHOLDER: '123',
			PAY: 'Pay Now'
		},
		MESSAGES: {
			PAYMENT_SUCCESS: 'Payment processed successfully',
			PAYMENT_FAILED: 'Payment processing failed'
		}
	},
	PRODUCT: {
		ADD_TO_CART: 'Add to Cart',
		OUT_OF_STOCK: 'Out of Stock',
		REVIEWS: 'Reviews',
		NO_REVIEWS: 'No reviews yet.',
		WRITE_REVIEW: 'Write a Review',
		REVIEW_PLACEHOLDER: 'Share your thoughts about this product...',
		QTY: 'Quantity'
	},
	ORDER_HISTORY: {
		TITLE: 'Order History',
		EMPTY: "You haven't placed any orders yet.",
		START_SHOPPING: 'Start Shopping',
		TRACKING: 'Tracking:',
		HIDE_DETAILS: 'Hide Details',
		VIEW_DETAILS: 'View Details',
		SHIPPING_DETAILS: 'Shipping Details',
		METHOD: 'Method:',
		ADDRESS: 'Address:',
		ORDER_ITEMS: 'Order Items'
	},
	PROFILE: {
		MESSAGES: {
			REVIEW_SUCCESS: 'Review submitted successfully!',
			REVIEW_DUPLICATE: 'You have already reviewed this product',
			REVIEW_FAILED: 'Failed to submit review'
		}
	},
	COMMON: {
		LOADING: 'Loading...',
		ERROR: 'An error occurred',
		CLOSE: 'Close',
		SAVE: 'Save',
		UNAUTHORIZED: 'Unauthorized'
	},
	VALIDATION: {
		ALL_FIELDS_REQUIRED: 'All fields required',
		ADDRESS_MIN_LENGTH: 'Address must be at least 10 chars',
		ADDRESS_REQUIRED: 'Address required',
		FILL_ALL_DETAILS: 'Fill all details',
		CARD_16_DIGITS: 'Card must be 16 digits',
		CVV_3_DIGITS: 'CVV must be 3 digits',
		ADDRESS_VALIDATION_ERROR:
			'Please check your input. Address must be at least 10 characters and Postal Code at least 5 digits.'
	},
	TOAST: {
		PAYMENT_SUCCESS: 'Payment Successful!',
		SCAN_TO_PAY: 'Scan to pay',
		ADDRESS_SUCCESS: 'Address saved successfully',
		SHIPPING_METHOD_REQUIRED: 'Please select a shipping method',
		INVALID_COUPON: 'Invalid coupon code',
		ADDED_TO_CART: 'Added to cart!',
		INVALID_IMAGE: 'Invalid image',
		IMAGE_UPDATED: 'Image updated',
		IMAGE_UPLOADED: 'Image uploaded: ',
		UPLOAD_FAILED: 'Upload failed'
	}
};
