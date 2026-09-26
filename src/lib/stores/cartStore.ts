import { writable } from 'svelte/store';
import { fetchCartItems } from '$lib/services/cartApiService';

export type CartItem = {
	product_id: number;
	price: number;
	quantity: number;
	title: string;
	image: string;
};

interface CartState {
	items: CartItem[];
	loading: boolean;
	error: string | null;
}

const defaultState: CartState = {
	items: [],
	loading: false,
	error: null
};

const createCartStore = () => {
	const { subscribe, set, update } = writable<CartState>(defaultState);

	async function getCart() {
		update((store) => ({ ...store, loading: true }));
		try {
			const payload = await fetchCartItems();
			update((store) => ({ ...store, items: payload, loading: false }));
		} catch (error) {
			update((store) => ({ ...store, error: (error as Error).message, loading: false }));
		}
	}

	return {
		subscribe,
		getCart,
		reset: () => set(defaultState),
		set,
		update
	};
};

export const cartStore = createCartStore();
