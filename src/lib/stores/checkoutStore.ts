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

const defaultState: CheckoutState = {
	address: '',
	addressDetails: null,
	shipping: null,
	payment: '',
	loading: false,
	error: null,
	coupon: null
};

function loadInitialState(): CheckoutState {
	if (typeof window === 'undefined') return defaultState;
	const stored = localStorage.getItem(STORAGE_KEYS.CHECKOUT);
	if (!stored) return defaultState;
	try {
		return JSON.parse(stored);
	} catch {
		localStorage.removeItem(STORAGE_KEYS.CHECKOUT);
		return defaultState;
	}
}

const createCheckoutStore = () => {
	const initialState = loadInitialState();
	const { subscribe, set, update } = writable<CheckoutState>(initialState);

	if (typeof window !== 'undefined') {
		subscribe((state) => {
			localStorage.setItem(STORAGE_KEYS.CHECKOUT, JSON.stringify(state));
		});
	}

	return {
		subscribe,
		setAddress: (address: string) => update((s) => ({ ...s, address })),
		setAddressDetails: (addressDetails: Record<string, unknown> | null) =>
			update((s) => ({ ...s, addressDetails })),
		setShipping: (shipping: Record<string, unknown> | null) => update((s) => ({ ...s, shipping })),
		setPayment: (payment: string) => update((s) => ({ ...s, payment })),
		setCoupon: (coupon: Record<string, unknown> | null) => update((s) => ({ ...s, coupon })),
		update,
		reset: () => set(defaultState)
	};
};

export const checkoutStore = createCheckoutStore();
