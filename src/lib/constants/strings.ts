export const STRINGS = {
	ADMIN: {
		TITLE: 'Admin Dashboard',
		TABS: {
			PRODUCTS: 'Product List',
			ORDERS: 'Order List'
		},
		PRODUCT_TABLE: {
			SEARCH_PLACEHOLDER: 'Search products...',
			ADD_BUTTON: 'Add Product',
			COLS: {
				TITLE: 'Title',
				PRICE: 'Price',
				STOCK: 'Stock',
				PICTURE: 'Picture',
				ACTION: 'Action'
			},
			UPLOAD: 'Upload Image'
		},
		ORDER_TABLE: {
			COLS: {
				ID: 'Order ID',
				TITLE: 'Title',
				USER: 'Username',
				QTY: 'Qty',
				PRICE: 'Price/pcs',
				TOTAL: 'Total',
				STATUS: 'Status',
				ACTION: 'Action'
			}
		},
		MODALS: {
			ADD_PRODUCT: {
				TITLE: 'Add Product',
				FIELDS: {
					TITLE: 'Title',
					DESC: 'Description',
					PRICE: 'Price',
					QTY: 'Quantity',
					IMAGE: 'Product Image'
				},
				CANCEL: 'Cancel',
				SUBMIT: 'Add Product'
			},
			UPDATE_STOCK: {
				TITLE: 'Update Stock',
				CURRENT: 'Current Stock',
				CANCEL: 'Cancel',
				SUBMIT: 'Update Stock'
			}
		}
	},
	SHOP: {
		SEARCH_PLACEHOLDER: 'Search books...',
		SHOW_MORE: 'Show More...',
		SHOW_MORE_MOBILE: 'Show More',
		FALLBACK_IMAGE: '/images/placeholder.jpg'
	},
	AUTH: {
		LOGIN: {
			TITLE: 'Login',
			SUBTITLE: 'Welcome back to Rumah Kosim',
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
		ADDRESS: {
			TITLE: 'Shipping Address',
			FIRST_NAME: 'First Name',
			LAST_NAME: 'Last Name',
			ADDRESS: 'Address',
			APARTMENT: 'Apartment, suite, etc. (optional)',
			CITY: 'City',
			POSTAL: 'Postal Code',
			PHONE: 'Phone',
			CONTINUE: 'Continue to Payment'
		},
		PAYMENT: {
			TITLE: 'Payment Details',
			CARD_NAME: 'Name on Card',
			CARD_NUMBER: 'Card Number',
			EXPIRY: 'Expiry Date',
			CVV: 'CVV',
			PAY: 'Pay Now'
		}
	},
	PRODUCT: {
		ADD_TO_CART: 'Add to Cart',
		OUT_OF_STOCK: 'Out of Stock',
		REVIEWS: 'Reviews',
		NO_REVIEWS: 'No reviews yet.',
		WRITE_REVIEW: 'Write a Review',
		QTY: 'Quantity'
	},
	COMMON: {
		LOADING: 'Loading...',
		ERROR: 'An error occurred',
		CLOSE: 'Close',
		SAVE: 'Save'
	},
	VALIDATION: {
		ALL_FIELDS_REQUIRED: 'All fields required',
		ADDRESS_MIN_LENGTH: 'Address must be at least 10 chars',
		ADDRESS_REQUIRED: 'Address required',
		FILL_ALL_DETAILS: 'Fill all details',
		CARD_16_DIGITS: 'Card must be 16 digits',
		CVV_3_DIGITS: 'CVV must be 3 digits'
	},
	TOAST: {
		PAYMENT_SUCCESS: 'Payment Successful!',
		SCAN_TO_PAY: 'Scan to pay'
	}
};
