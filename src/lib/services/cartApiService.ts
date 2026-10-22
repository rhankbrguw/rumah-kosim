import { API_ROUTES } from '$lib/constants/routes';
import { InternalException } from '$lib/errors.js';
import { MESSAGES } from '$lib/constants/messages.js';

export const fetchCartItems = async () => {
	const response = await fetch(API_ROUTES.CART);
	if (!response.ok) {
		throw new InternalException(MESSAGES.ERROR.FETCH_CART_FAILED);
	}
	const payload = await response.json();
	return payload.data || payload;
};
