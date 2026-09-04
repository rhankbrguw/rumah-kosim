import { API_ROUTES } from '$lib/constants/routes';

export const logoutUser = async () => {
	return await fetch(API_ROUTES.AUTH.LOGOUT, { method: 'POST' });
};
