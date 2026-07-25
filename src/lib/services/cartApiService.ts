import { API_ROUTES } from '$lib/constants/routes';

export const fetchCartItems = async () => {
	const response = await fetch(API_ROUTES.CART);
	if (!response.ok) throw new Error('Failed to fetch cart');
	const payload = await response.json();
	return payload.data || payload;
};
