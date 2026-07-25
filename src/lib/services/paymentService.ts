import { cartStore } from '$lib/stores/cartStore';
import { checkoutStore } from '$lib/stores/checkoutStore';
import { toast } from 'svelte-sonner';
import { goto } from '$app/navigation';
import { STRINGS } from '$lib/constants/strings';
import { ANIMATION } from '$lib/constants/config';

export function handleMidtransPayment(
	snapToken: string,
	callbacks: {
		onStart?: () => void;
		onError?: () => void;
		onClose?: () => void;
	}
) {
	// @ts-expect-error Snap is injected by midtrans script global
	window.snap.pay(snapToken, {
		onSuccess: async () => {
			if (callbacks.onStart) callbacks.onStart();
			await cartStore.reset();
			checkoutStore.reset();
			toast.success(STRINGS.TOAST.PAYMENT_SUCCESS);
			setTimeout(() => goto('/client/profile/history'), ANIMATION.REDIRECT_DELAY_MS || 2000);
		},
		onPending: async () => {
			if (callbacks.onStart) callbacks.onStart();
			await cartStore.reset();
			checkoutStore.reset();
			toast.success('Order placed. Waiting for payment!');
			setTimeout(() => goto('/client/profile/history'), ANIMATION.REDIRECT_DELAY_MS || 2000);
		},
		onError: () => {
			if (callbacks.onError) callbacks.onError();
			toast.error('Payment failed!');
		},
		onClose: () => {
			if (callbacks.onClose) callbacks.onClose();
			toast.error('Payment cancelled');
		}
	});
}
