import { STORE_CONSTANTS } from '$lib/constants/config';
import { checkoutStore } from '$lib/stores/checkoutStore';

export function validateShippingCoupon(
	code: string,
	currentShippingOption: Record<string, unknown> | null
) {
	const isValidCoupon = code.toUpperCase() === STORE_CONSTANTS.PROMO_SHIPPING_CODE;
	if (isValidCoupon && currentShippingOption) {
		checkoutStore.setShipping({ ...currentShippingOption, price: 0 });
	}
	return isValidCoupon;
}

export function calculateOrderTotal(
	subtotal: number,
	selectedShipping: string,
	shippingOptions: { id: string; price: number }[],
	isValidCoupon: boolean
) {
	const shipping = selectedShipping
		? (shippingOptions.find((opt) => opt.id === selectedShipping)?.price as number) || 0
		: 0;
	return subtotal + (isValidCoupon ? 0 : shipping);
}
