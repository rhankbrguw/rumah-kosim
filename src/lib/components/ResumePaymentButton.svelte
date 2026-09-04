<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { PUBLIC_MIDTRANS_CLIENT_KEY } from '$env/static/public';
	import { CHECKOUT_STRINGS } from '$lib/constants/checkoutStrings.js';
	import { STRINGS } from '$lib/constants/strings.js';
	import { EXTERNAL_ROUTES } from '$lib/constants/routes.js';
	import { getPendingPaymentToken, handleMidtransPayment } from '$lib/services/paymentService.js';

	export let orderId: number;
	let isLoading = false;

	async function resumePayment() {
		if (isLoading) return;
		isLoading = true;
		try {
			const snapToken = await getPendingPaymentToken(orderId);
			handleMidtransPayment(snapToken, {
				onSuccess: () => toast.success(CHECKOUT_STRINGS.MESSAGES.PAYMENT_SUCCESS),
				onPending: () => toast.info(CHECKOUT_STRINGS.MESSAGES.PAYMENT_PENDING),
				onError: () => toast.error(CHECKOUT_STRINGS.MESSAGES.PAYMENT_FAILED),
				onSyncError: () => toast.error(CHECKOUT_STRINGS.MESSAGES.PAYMENT_SYNC_FAILED),
				onClose: () => toast.info(CHECKOUT_STRINGS.PAYMENT.PAYMENT_CANCELLED)
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : CHECKOUT_STRINGS.MESSAGES.INIT_FAILED);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<script
		src={EXTERNAL_ROUTES.MIDTRANS_SNAP_SANDBOX}
		data-client-key={PUBLIC_MIDTRANS_CLIENT_KEY}
	></script>
</svelte:head>

<button
	type="button"
	class="min-h-11 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-text-inverse transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
	on:click={resumePayment}
	disabled={isLoading}
>
	{isLoading ? STRINGS.COMMON.LOADING : CHECKOUT_STRINGS.PAYMENT.PAY}
</button>
