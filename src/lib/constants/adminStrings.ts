export const ADMIN_STRINGS = {
	TITLE: 'Admin Dashboard',
	TABS: {
		PRODUCTS: 'Product List',
		ORDERS: 'Order List'
	},
	PRODUCT_TABLE: {
		SEARCH_PLACEHOLDER: 'Search products...',
		ADD_BUTTON: 'Add Product',
		STOCK_LABEL: 'Stock',
		EDIT_STOCK: 'Edit stock',
		DELETE_PRODUCT: 'Delete product',
		COLS: {
			TITLE: 'Title',
			PRICE: 'Price',
			STOCK: 'Stock',
			PICTURE: 'Picture',
			ACTION: 'Action'
		},
		UPLOAD: 'Upload Image'
	},
	CONFIRM_DELETE: {
		TITLE: 'Delete product?',
		MESSAGE: 'This action permanently removes the product from the catalog.',
		PROMPT: 'Delete this product? This action cannot be undone.',
		CANCEL: 'Keep product',
		CONFIRM: 'Delete product',
		PROCESSING: 'Deleting...'
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
		EDIT_PRODUCT: {
			TITLE: 'Edit Product',
			SUBMIT: 'Save Changes'
		},
		TABS: {
			BASIC: 'Basic Info',
			PRICING: 'Pricing & Stock',
			IMAGE: 'Image'
		},
		UPDATE_STOCK: {
			TITLE: 'Update Stock',
			CURRENT: 'Current Stock',
			CANCEL: 'Cancel',
			SUBMIT: 'Update Stock'
		},
		IMAGE: {
			REMOVE: 'Remove image',
			UPLOAD_HINT: 'Choose an image file',
			FORMAT_HINT: 'JPG, PNG, GIF, or WEBP (max. 5 MB)'
		}
	},
	MESSAGES: {
		ADD_SUCCESS: 'Product added successfully',
		ADD_FAIL: 'Failed to add product',
		STOCK_UPDATED: 'Stock updated',
		STOCK_FAIL: 'Failed to update stock',
		STATUS_UPDATED: 'Status updated',
		STATUS_FAIL: 'Failed to update status',
		DELETE_SUCCESS: 'Product deleted',
		DELETE_FAIL: 'Failed to delete product',
		MISSING_ID_IMAGE: 'Missing id or image',
		UPLOAD_SUCCESS: 'Image uploaded successfully',
		INVALID_IMAGE_SIZE: 'Image must be 5 MB or smaller',
		INVALID_IMAGE_TYPE: 'Use a JPG, PNG, GIF, or WEBP image'
	}
};
