export const CHECKOUT_STRINGS = {
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
		SELECT_PROVINCE: 'Select Province',
		SELECT_REGENCY: 'Select City or Regency',
		SELECT_DISTRICT: 'Select District',
		SELECT_VILLAGE: 'Select Village or Subdistrict',
		LOCATION_LOAD_ERROR:
			'Unable to load location options. You can still enter your address manually.',
		PHONE: 'Phone',
		CONTINUE: 'Continue to Shipping',
		COUPON_PLACEHOLDER: 'Enter coupon code here',
		SAVED_ADDRESS: 'Pilih Alamat Tersimpan',
		MAIN: 'Utama',
		USE_NEW: 'Gunakan Alamat Baru',
		NEW_DETAIL: 'Detail Alamat Baru',
		SAVE_INFO: 'Simpan alamat ini untuk ke depannya',
		LABEL_PLACEHOLDER: 'Beri nama alamat (Contoh: Rumah, Kantor, Kosan)'
	},
	SHIPPING: {
		CONTINUE: 'Continue to Payment',
		METHOD_REQUIRED: 'Please select a shipping method first',
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
		PAY: 'Pay Now',
		SECURE_GATEWAY_TITLE: 'Secure Payment Gateway',
		SECURE_GATEWAY_DESC:
			'You will be securely redirected to Midtrans to complete your transaction with bank-grade encryption.',
		REDIRECT_SUCCESS: 'Payment Successful!',
		REDIRECT_DESC: 'Redirecting to your order history...',
		PENDING_TITLE: 'Waiting for Payment',
		PENDING_DESCRIPTION:
			'Your order has been saved. Redirecting to your order history where you can complete the payment later...',
		SUCCESS_TITLE: 'Payment Successful!',
		SUCCESS_DESCRIPTION:
			'Your transaction has been securely processed. Redirecting to your order history...',
		PAYMENT_CANCELLED: 'Payment window closed. You can resume payment from your order history.'
	},
	MESSAGES: {
		PAYMENT_SUCCESS: 'Payment processed successfully',
		PAYMENT_FAILED: 'Payment processing failed',
		PAYMENT_SYNC_FAILED: 'Payment completed, but order confirmation is still processing.',
		PAYMENT_CANCELLED: 'Payment cancelled',
		PAYMENT_PENDING: 'Order placed. Waiting for payment!',
		INIT_FAILED: 'Failed to initialize payment'
	}
};
