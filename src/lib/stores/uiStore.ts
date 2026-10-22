import { STORAGE_KEYS } from '$lib/constants/storageKeys';

const isBrowser = typeof window !== 'undefined';

export const shippingModalStore = {
	checkAndShow: (userId: number) => {
		if (!isBrowser) return false;
		const key = `${STORAGE_KEYS.SHIPPING_MODAL_PREFIX}${userId}`;
		if (!localStorage.getItem(key)) {
			localStorage.setItem(key, 'true');
			return true;
		}
		return false;
	}
};

export const profileFormStore = {
	save: (form: Record<string, unknown>) => {
		if (!isBrowser) return;
		const formPayload = { ...form };
		delete formPayload.password;
		localStorage.setItem(STORAGE_KEYS.PROFILE_FORM, JSON.stringify(formPayload));
	},
	load: (formStore: import('svelte/store').Writable<Record<string, unknown>>) => {
		if (!isBrowser) return;
		const saved = localStorage.getItem(STORAGE_KEYS.PROFILE_FORM);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				delete parsed.password;
				delete parsed.confirmPassword;
				formStore.update((f) => ({ ...f, ...parsed }));
			} catch {
				/* ignore */
			}
		}
	},
	clear: () => {
		if (isBrowser) localStorage.removeItem(STORAGE_KEYS.PROFILE_FORM);
	}
};
