import { writable } from 'svelte/store';

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

	let initialState = defaultState;
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('checkoutStore');
		if (stored) {
			try {
				initialState = { ...defaultState, ...JSON.parse(stored) };
			} catch (e) {
				// Suppress parsing exceptions during initialization
			}
		}
	}

	const { subscribe, set, update } = writable<CheckoutState>(initialState);

	if (typeof window !== 'undefined') {
		subscribe((state) => {
			localStorage.setItem('checkoutStore', JSON.stringify(state));
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
		reset: () =>
			set(defaultState)
	};
};

export const checkoutStore = createCheckoutStore();
