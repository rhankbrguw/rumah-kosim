export const ADMIN_STRINGS = {
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
		MISSING_ID_IMAGE: 'Missing id or image'
	}
};
