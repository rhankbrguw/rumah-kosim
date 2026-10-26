import type { Writable } from 'svelte/store';
import { STORAGE_KEYS } from '$lib/constants/storageKeys';

export function loadForm(
	key: string,
	store: Writable<Record<string, unknown>>,
	omit: string[] = []
) {
	if (typeof window === 'undefined') return;
	const saved = localStorage.getItem(key);
	if (saved) {
		try {
			const payload = JSON.parse(saved);
			omit.forEach((k) => delete payload[k]);
			Object.assign(store, payload);
		} catch {
			// Ignore parsing error, fallback to default state
			return;
		}
	}
}

export function saveLoginForm(form: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	const payload = { ...form };
	delete payload.password;
	localStorage.setItem(STORAGE_KEYS.LOGIN_FORM, JSON.stringify(payload));
}

export function saveSignupForm(form: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	const payload = { ...form };
	delete payload.password;
	delete payload.confirmPassword;
	localStorage.setItem(STORAGE_KEYS.SIGNUP_FORM, JSON.stringify(payload));
}

export function saveForgotForm(form: Record<string, unknown>) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEYS.FORGOT_FORM, JSON.stringify(form));
}
