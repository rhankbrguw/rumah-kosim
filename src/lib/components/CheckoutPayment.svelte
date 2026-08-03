<script lang="ts">
	import { PUBLIC_MIDTRANS_CLIENT_KEY } from '$env/static/public';
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { STRINGS } from '$lib/constants/strings';
	import { STORE_CONSTANTS } from '$lib/constants/config';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CheckoutSummary from './CheckoutSummary.svelte';
	import CheckoutProgressBar from './CheckoutProgressBar.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import CheckoutSecurityBanner from './CheckoutSecurityBanner.svelte';
	import CheckoutRedirectingOverlay from './CheckoutRedirectingOverlay.svelte';
	import CheckoutPaymentSubmitButton from './CheckoutPaymentSubmitButton.svelte';
	import PaymentSuccessModal from './PaymentSuccessModal.svelte';
	import PaymentPendingModal from './PaymentPendingModal.svelte';

	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number; quantity: number; title?: string; image?: string }[] = [];

	import { onMount } from 'svelte';
	onMount(() => {
		if (!$checkoutStore.address) {
			toast.error(STRINGS.VALIDATION.ADDRESS_REQUIRED || 'Please fill in your address first');
			goto('/client/checkout/address');
		} else if (!$checkoutStore.shipping) {
			toast.error('Please select a shipping method first');
			goto('/client/checkout/shipping');
		}
	});

	const { form, enhance, message } = superForm(data, {
		onSubmit: ({ formData, cancel }) => {
			isLoading = true;
			if (!$checkoutStore.address) {
				isLoading = false;
				toast.error(STRINGS.VALIDATION.ADDRESS_REQUIRED);
				cancel();
				return;
			}

			formData.set('cartItemsJson', JSON.stringify(cartItems));
			formData.set('total', total.toString());
			formData.set('shippingAddress', $checkoutStore.address);
			formData.set('shippingPrice', shippingCost.toString());
			formData.set('shippingMethod', ($checkoutStore.shipping?.method || 'GOSEND') as string);
		},
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.form?.message?.snapToken) {
				const snapToken = result.data.form.message.snapToken;

				const { handleMidtransPayment } = await import('$lib/services/paymentService');
				const { CLIENT_ROUTES } = await import('$lib/constants/routes');
				handleMidtransPayment(snapToken, {
					onStart: () => {
						isRedirecting = true;
					},
					onSuccess: () => {
						isSuccessModalOpen = true;
						setTimeout(() => goto(CLIENT_ROUTES.HISTORY), 2500);
					},
					onPending: () => {
						isPendingModalOpen = true;
						setTimeout(() => goto(CLIENT_ROUTES.HISTORY), 2500);
					},
					onError: () => {
						isLoading = false;
						isRedirecting = false;
						toast.error(STRINGS.CHECKOUT.MESSAGES.PAYMENT_FAILED || 'Payment failed');
					},
					onClose: () => {
						isPendingModalOpen = true;
						setTimeout(() => goto(CLIENT_ROUTES.HISTORY), 2500);
					}
				});
			} else {
				isLoading = false;
				const resData = result as { data?: { form?: { message?: string | { text?: string } } } };
				toast.error(
					typeof resData.data?.form?.message === 'string'
						? resData.data.form.message
						: resData.data?.form?.message?.text || 'Failed to initialize payment'
				);
			}
		}
	});

	let isLoading = false;
	let isRedirecting = false;
	let isSuccessModalOpen = false;
	let isPendingModalOpen = false;

	$: hasFreeShipping = $checkoutStore.shipping?.price === 0;
	$: shippingCost = hasFreeShipping
		? 0
		: ($checkoutStore.shipping?.price as number) || STORE_CONSTANTS.SHIPPING_RATES.GOSEND;
	$: subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	$: total = subtotal + shippingCost;
</script>

<svelte:head>
	<script
		src="https://app.sandbox.midtrans.com/snap/snap.js"
		data-client-key={PUBLIC_MIDTRANS_CLIENT_KEY}
	></script>
</svelte:head>

<div class="min-h-screen w-full bg-surface pb-20 pt-24 md:pt-32">
	<div class="mx-auto max-w-5xl px-4 sm:px-8">
		<h1 class="mb-6 text-xl font-semibold text-text-main sm:text-2xl">
			{STRINGS.CHECKOUT.TITLE}
		</h1>

		<CheckoutProgressBar activeStep={2} />

		{#if $message}
			<div
				class="mb-6 rounded-xl p-3 text-sm {$page.status >= 400
					? 'bg-danger-light text-danger'
					: 'bg-primary-light text-primary'}"
			>
				{typeof $message === 'string' ? $message : $message.text || 'Success'}
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr,26rem] lg:gap-16">
			<div class="pt-2">
				<form method="POST" use:enhance class="space-y-5">
					<input type="hidden" name="cartItemsJson" value={$form.cartItemsJson} />
					<input type="hidden" name="total" value={$form.total} />
					<input type="hidden" name="shippingAddress" value={$form.shippingAddress} />
					<input type="hidden" name="shippingPrice" value={$form.shippingPrice} />
					<input type="hidden" name="shippingMethod" value={$form.shippingMethod} />

					<CheckoutSecurityBanner />

					<CheckoutPaymentSubmitButton {isLoading} />
				</form>
			</div>
			<CheckoutSummary {cartItems} {subtotal} {total} {shippingCost} {hasFreeShipping} />
		</div>
	</div>
</div>

{#if isRedirecting}
	<CheckoutRedirectingOverlay />
{/if}

<PaymentSuccessModal show={isSuccessModalOpen} />
<PaymentPendingModal show={isPendingModalOpen} />
