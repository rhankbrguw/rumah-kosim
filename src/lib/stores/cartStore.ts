import { writable } from 'svelte/store';
import axios from 'axios';

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

const createCartStore = () => {
	const { subscribe, set, update } = writable<CartState>({
		items: [],
		loading: false,
		error: null
	});

	return {
		subscribe,
		async getCart() {
			update((store) => ({ ...store, loading: true }));
			try {
				const response = await axios.get('/api/cart');

				update((store) => ({
					...store,
					items: response.data.data || response.data,
					loading: false
				}));
			} catch (error) {
				update((store) => ({
					...store,
					error: (error as Error).message,
					loading: false
				}));
			}
		},
		reset: () => set({ items: [], loading: false, error: null }),
		set,
		update
	};
};

export const cartStore = createCartStore();
