import { writable } from 'svelte/store';
import { STORAGE_KEYS } from '$lib/constants/storageKeys';

interface CheckoutState {
	address: string;
	addressDetails: Record<string, unknown> | null;
	shipping: Record<string, unknown> | null;
	payment: string;
	loading: boolean;
	error: string | null;
	coupon: Record<string, unknown> | null;
	items?: Record<string, unknown>[];
	subtotal?: number;
	shippingCost?: number;
	total?: number;
}

const createCheckoutStore = () => {
	const defaultState: CheckoutState = {
		address: '',
		addressDetails: null,
		shipping: null,
		payment: '',
		loading: false,
		error: null,
		coupon: null
	};

	const { subscribe, set, update } = writable<CheckoutState>(defaultState);

	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(STORAGE_KEYS.CHECKOUT);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				set(parsed);
			} catch {
				// Ignore JSON parse errors, fallback to empty object
				localStorage.removeItem(STORAGE_KEYS.CHECKOUT);
			}
		}

		subscribe((state) => {
			localStorage.setItem(STORAGE_KEYS.CHECKOUT, JSON.stringify(state));
		});
	}

	return {
		subscribe,
		setAddress: (address: string) => update((store) => ({ ...store, address })),
		setAddressDetails: (addressDetails: Record<string, unknown> | null) =>
			update((store) => ({ ...store, addressDetails })),
		setShipping: (shipping: Record<string, unknown> | null) =>
			update((store) => ({ ...store, shipping })),
		setPayment: (payment: string) => update((store) => ({ ...store, payment })),
		setCoupon: (coupon: Record<string, unknown> | null) =>
			update((store) => ({ ...store, coupon })),
		update,
		reset: () => set(defaultState)
	};
};

export const checkoutStore = createCheckoutStore();
