import { derived } from 'svelte/store';
import { logoutUser } from '$lib/services/authApiService';
import { CLIENT_ROUTES } from '$lib/constants/routes';
import { page } from '$app/stores';
import { browser } from '$app/environment';

export const auth = derived(page, ($page) => {
	const user = $page.data.user;
	return {
		isAuthenticated: !!user,
		user: user || null,
		isAdmin: user?.role === 'admin'
	};
});

export async function logout() {
	if (browser) {
		await logoutUser();
		window.location.href = CLIENT_ROUTES.AUTH;
	}
}
