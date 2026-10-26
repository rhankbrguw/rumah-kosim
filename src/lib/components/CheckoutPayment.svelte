<script lang="ts">
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { STRINGS } from '$lib/constants/strings';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import CheckoutSummary from './CheckoutSummary.svelte';
	import CheckoutProgressBar from './CheckoutProgressBar.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import CheckoutRedirectingOverlay from './CheckoutRedirectingOverlay.svelte';
	import CheckoutPaymentForm from './CheckoutPaymentForm.svelte';
	import PaymentSuccessModal from './PaymentSuccessModal.svelte';
	import PaymentPendingModal from './PaymentPendingModal.svelte';
	import CheckoutSnapPayment from './CheckoutSnapPayment.svelte';
	import { CLIENT_ROUTES } from '$lib/constants/routes.js';
	import { ANIMATION } from '$lib/constants/config.js';

	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number; quantity: number; title?: string; image?: string }[] = [];

	let isLoading = false;
	let isRedirecting = false;
	let isSuccessModalOpen = false;
	let isPendingModalOpen = false;
	let snapToken = '';

	onMount(() => {
		if (!$checkoutStore.address) {
			toast.error(STRINGS.VALIDATION.ADDRESS_REQUIRED);
			goto(CLIENT_ROUTES.CHECKOUT_ADDRESS);
		} else if (!$checkoutStore.shipping) {
			toast.error(STRINGS.CHECKOUT.SHIPPING.METHOD_REQUIRED);
			goto(CLIENT_ROUTES.CHECKOUT_SHIPPING);
		}
	});

	$: hasFreeShipping = $checkoutStore.shipping?.price === 0;
	$: shippingCost = hasFreeShipping
		? 0
		: typeof $checkoutStore.shipping?.price === 'number'
			? $checkoutStore.shipping.price
			: 0;
	$: subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	$: total = subtotal + shippingCost;

	function redirectToHistory() {
		setTimeout(() => goto(CLIENT_ROUTES.HISTORY), ANIMATION.REVIEW_REDIRECT_MS);
	}

	function handlePaymentSuccess() {
		isSuccessModalOpen = true;
		redirectToHistory();
	}

	function handlePaymentPending() {
		isPendingModalOpen = true;
		redirectToHistory();
	}

	function handlePaymentError() {
		isLoading = false;
		isRedirecting = false;
		toast.error(STRINGS.CHECKOUT.MESSAGES.PAYMENT_FAILED);
	}

	function handlePaymentClose() {
		isPendingModalOpen = true;
		redirectToHistory();
	}
</script>

<div class="min-h-screen w-full bg-surface pb-16 pt-20 md:pt-28">
	<div class="mx-auto max-w-5xl px-3.5 sm:px-6 md:px-8">
		<h1 class="mb-4 text-lg font-bold text-text-main sm:mb-6 sm:text-2xl">
			{STRINGS.CHECKOUT.TITLE}
		</h1>

		<CheckoutProgressBar activeStep={2} />

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,24rem] lg:gap-12">
			<div class="pt-1">
				<CheckoutPaymentForm
					{data}
					{cartItems}
					{total}
					{shippingCost}
					bind:isLoading
					on:paymentReady={(event) => (snapToken = event.detail)}
				/>
			</div>
			<CheckoutSummary {cartItems} {subtotal} {total} {shippingCost} {hasFreeShipping} />
		</div>
	</div>
</div>

<CheckoutSnapPayment
	{snapToken}
	on:start={() => (isRedirecting = true)}
	on:success={handlePaymentSuccess}
	on:pending={handlePaymentPending}
	on:error={handlePaymentError}
	on:close={handlePaymentClose}
/>

{#if isRedirecting}
	<CheckoutRedirectingOverlay />
{/if}

<PaymentSuccessModal show={isSuccessModalOpen} />
<PaymentPendingModal show={isPendingModalOpen} />
