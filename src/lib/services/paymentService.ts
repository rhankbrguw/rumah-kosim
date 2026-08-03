import { cartStore } from '$lib/stores/cartStore';
import { checkoutStore } from '$lib/stores/checkoutStore';

export function handleMidtransPayment(
	snapToken: string,
	callbacks: {
		onStart?: () => void;
		onSuccess?: () => void;
		onPending?: () => void;
		onError?: () => void;
		onClose?: () => void;
	}
): void {
	try {
		// @ts-expect-error Snap is injected by midtrans script global
		if (typeof window === 'undefined' || !window.snap) {
			console.error(
				'Midtrans Snap is not loaded. Please check your connection or disable adblockers.'
			);
			if (callbacks.onError) callbacks.onError();
			return;
		}

		if (callbacks.onStart) callbacks.onStart();

		// @ts-expect-error Snap is injected by midtrans script global
		window.snap.pay(snapToken, {
			onSuccess: async () => {
				await clearStores();
				if (callbacks.onSuccess) callbacks.onSuccess();
			},
			onPending: async () => {
				await clearStores();
				if (callbacks.onPending) callbacks.onPending();
			},
			onError: () => {
				if (callbacks.onError) callbacks.onError();
			},
			onClose: () => {
				if (callbacks.onClose) callbacks.onClose();
			}
		});
	} catch (error) {
		console.error('Failed to initialize Midtrans payment:', error);
		if (callbacks.onError) callbacks.onError();
	}
}

async function clearStores() {
	await cartStore.reset();
	checkoutStore.reset();
}
