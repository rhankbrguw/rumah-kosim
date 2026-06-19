import { derived } from 'svelte/store';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
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
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.href = '/client/auth';
	}
}

export function restoreAuth() {
	// Handled natively by +layout.server.ts via SSR
}
