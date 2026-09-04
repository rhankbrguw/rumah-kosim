import { cartStore } from '$lib/stores/cartStore';
import { checkoutStore } from '$lib/stores/checkoutStore';
import { API_ROUTES } from '$lib/constants/routes';
import { CHECKOUT_STRINGS } from '$lib/constants/checkoutStrings';

export async function getPendingPaymentToken(orderId: number): Promise<string> {
	const response = await fetch(`${API_ROUTES.ORDERS}/${orderId}/payment`);
	const payload = (await response.json()) as { data?: { snapToken?: string } };
	if (!response.ok || !payload.data?.snapToken) {
		throw new Error(CHECKOUT_STRINGS.MESSAGES.INIT_FAILED);
	}
	return payload.data.snapToken;
}

export function handleMidtransPayment(
	snapToken: string,
	callbacks: {
		onStart?: () => void;
		onSuccess?: (result?: Record<string, unknown>) => void;
		onPending?: (result?: Record<string, unknown>) => void;
		onError?: (result?: Record<string, unknown>) => void;
		onClose?: () => void;
		onSyncError?: () => void;
	}
): void {
	try {
		// @ts-expect-error Snap is injected by midtrans script global
		if (typeof window === 'undefined' || !window.snap) {
			if (callbacks.onError) callbacks.onError();
			return;
		}

		if (callbacks.onStart) callbacks.onStart();

		// @ts-expect-error Snap is injected by midtrans script global
		window.snap.pay(snapToken, {
			onSuccess: async (result: Record<string, unknown>) => {
				await clearStores();
				const isSynced = await syncPaymentStatus(result);
				if (!isSynced) callbacks.onSyncError?.();
				if (callbacks.onSuccess) callbacks.onSuccess(result);
			},
			onPending: async (result: Record<string, unknown>) => {
				await clearStores();
				const isSynced = await syncPaymentStatus(result);
				if (!isSynced) callbacks.onSyncError?.();
				if (callbacks.onPending) callbacks.onPending(result);
			},
			onError: (result: Record<string, unknown>) => {
				if (callbacks.onError) callbacks.onError(result);
			},
			onClose: () => {
				if (callbacks.onClose) callbacks.onClose();
			}
		});
	} catch {
		if (callbacks.onError) callbacks.onError();
	}
}

async function syncPaymentStatus(result: Record<string, unknown>): Promise<boolean> {
	try {
		if (result && (result.order_id || result.transaction_status)) {
			const response = await fetch(API_ROUTES.WEBHOOKS.MIDTRANS, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(result)
			});
			return response.ok;
		}
		return false;
	} catch {
		return false;
	}
}

async function clearStores() {
	await cartStore.reset();
	checkoutStore.reset();
}
