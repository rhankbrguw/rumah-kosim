import { writable } from 'svelte/store';

interface CheckoutState {
	address: string;
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
	const { subscribe, set, update } = writable<CheckoutState>({
		address: '',
		shipping: null,
		payment: '',
		loading: false,
		error: null,
		coupon: null
	});

	return {
		subscribe,
		setAddress: (address: string) => update((store) => ({ ...store, address })),
		setShipping: (shipping: Record<string, unknown> | null) =>
			update((store) => ({ ...store, shipping })),
		setPayment: (payment: string) => update((store) => ({ ...store, payment })),
		setCoupon: (coupon: Record<string, unknown> | null) =>
			update((store) => ({ ...store, coupon })),
		update,
		reset: () =>
			set({
				address: '',
				shipping: null,
				payment: '',
				loading: false,
				error: null,
				coupon: null
			})
	};
};

export const checkoutStore = createCheckoutStore();
