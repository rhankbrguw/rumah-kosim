import { ADMIN_STRINGS } from './adminStrings';
import { AUTH_STRINGS } from './authStrings';
import { CHECKOUT_STRINGS } from './checkoutStrings';

export const STRINGS = {
	ADMIN: ADMIN_STRINGS,
	HERO: {
		TITLE_PART_1: 'Books are the windows to the world, and',
		TITLE_HIGHLIGHT: 'RumahKosimBook',
		TITLE_PART_2: 'is the door that invites you in.',
		SUBTITLE: 'Discover your favorite stories and treasures at RumahKosimBook—',
		CTA_BUTTON: 'Explore Us',
		BG_IMAGE_URL: '/images/bg-ruko.png'
	},
	ABOUT: {
		TITLE: 'What is RumahKosimBook?',
		DESCRIPTION: [
			'RumahKosimBook is a cozy and vibrant bookstore located in the heart of Jakarta. Established with a passion for literature and learning, RumahKosimBook offers a wide selection of books ranging from fiction, non-fiction, educational resources, to rare and collectible editions.',
			"Our mission is to inspire a love for reading and provide a welcoming space where book enthusiasts can explore, discover, and immerse themselves in the world of knowledge and imagination. Whether you're looking for the latest bestseller, a classic novel, or a special gift for a fellow book lover, RumahKosimBook has something for everyone."
		],
		IMAGE_ALT: 'Profile of Founder'
	},
	SHOP: {
		SEARCH_PLACEHOLDER: 'Search books...',
		SHOW_MORE: 'Details',
		SHOW_MORE_MOBILE: 'Details',
		FALLBACK_IMAGE: '/images/placeholder.jpg'
	},
	AUTH: AUTH_STRINGS,
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
	CHECKOUT: CHECKOUT_STRINGS,
	PRODUCT: {
		ADD_TO_CART: 'Add to Cart',
		OUT_OF_STOCK: 'Out of Stock',
		REVIEWS: 'Reviews',
		NO_REVIEWS: 'No reviews yet.',
		WRITE_REVIEW: 'Write a Review',
		REVIEW_PLACEHOLDER: 'Share your thoughts about this product...',
		QTY: 'Quantity',
		EDITORIAL_REVIEWS: 'Editorial Reviews',
		CUSTOMER_REVIEWS: 'Customer Reviews',
		NO_REVIEWS_YET: 'No reviews yet. Buy this product to be the first to review!'
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
			REVIEW_FAILED: 'Failed to submit review',
			UPDATE_SUCCESS: 'Profile updated successfully!'
		},
		TITLE: 'My Profile',
		FIELDS: {
			FULL_NAME: 'Full Name',
			FULL_NAME_PLACEHOLDER: 'John Doe',
			PHONE: 'Phone Number',
			PHONE_PREFIX: '+62',
			PHONE_PLACEHOLDER: '812 3456 7890',
			USERNAME: 'Username',
			EMAIL: 'Email',
			ADDRESS: 'Address',
			ADDRESS_PLACEHOLDER: '123 Main St, City, Country',
			PASSWORD: 'New Password (leave blank to keep current)',
			PASSWORD_PLACEHOLDER: '••••••••'
		},
		ADDRESS_BOOK: {
			SAVED_ADDRESS: 'Pilih Alamat Tersimpan',
			SELECT_PLACEHOLDER: 'Pilih alamat dari Address Book',
			MAIN: 'Utama'
		},
		BUTTON_UPDATE: 'Update Profile'
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
		PAYMENT_SUCCESS: 'Payment Successful!', SCAN_TO_PAY: 'Scan to pay', ADDRESS_SUCCESS: 'Address saved successfully',
		SHIPPING_METHOD_REQUIRED: 'Please select a shipping method', INVALID_COUPON: 'Invalid coupon code', ADDED_TO_CART: 'Added to cart!',
		INVALID_IMAGE: 'Invalid image', IMAGE_UPDATED: 'Image updated', IMAGE_UPLOADED: 'Image uploaded: ', UPLOAD_FAILED: 'Upload failed'
	},
	AI_CS: {
		TITLE: 'Rumah Kosim AI',
		SUBTITLE: 'Online • Industry Standard CS',
		GREETING: 'Halo! Saya AI Assistant Rumah Kosim Book. Ada yang bisa saya bantu terkait ketersediaan buku hari ini?',
		PLACEHOLDER: 'Tanya ketersediaan buku...',
		ERROR_SERVER: 'Maaf, terjadi kesalahan pada server kami.',
		ERROR_CONNECTION: 'Koneksi terputus. Silakan coba lagi.'
	}
};
