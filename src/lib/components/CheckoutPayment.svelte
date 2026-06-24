<script lang="ts">
	import { PUBLIC_MIDTRANS_CLIENT_KEY } from '$env/static/public';
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { cartStore } from '$lib/stores/cartStore';
	import { STRINGS } from '$lib/constants/strings';
	import { STORE_CONSTANTS } from '$lib/constants/config';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CheckoutSummary from './CheckoutSummary.svelte';
	import CheckoutProgressBar from './CheckoutProgressBar.svelte';
	import CardForm from './CardForm.svelte';
	import PaymentMethodSelector from './PaymentMethodSelector.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number, quantity: number, title?: string, image?: string }[] = [];

	const { form, enhance, message } = superForm(data, {
		onSubmit: ({ formData, cancel }) => {
			loading = true;
			if (!$checkoutStore.address) {
				loading = false;
				toast.error(STRINGS.VALIDATION.ADDRESS_REQUIRED);
				cancel();
				return;
			}

			formData.set('cartItemsJson', JSON.stringify(cartItems));
			formData.set('total', total.toString());
			formData.set('shippingAddress', $checkoutStore.address);
			formData.set('shippingPrice', shippingCost.toString());
			formData.set('shippingMethod', paymentMethod);
			formData.set('paymentMethod', paymentMethod);
		},
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.form?.message?.snapToken) {
				const snapToken = result.data.form.message.snapToken;
				
				// @ts-ignore - Midtrans snap global
				window.snap.pay(snapToken, {
					onSuccess: async function(snapResult: any) {
						isRedirecting = true;
						await cartStore.reset();
						checkoutStore.setAddress('');
						toast.success(STRINGS.TOAST.PAYMENT_SUCCESS);
						setTimeout(() => goto('/client/profile/history'), 2000);
					},
					onPending: async function(snapResult: any) {
						await cartStore.reset();
						checkoutStore.setAddress('');
						toast.success('Order placed. Waiting for payment!');
						setTimeout(() => goto('/client/profile/history'), 2000);
					},
					onError: function(snapResult: any) {
						loading = false;
						toast.error('Payment failed!');
					},
					onClose: function() {
						loading = false;
						toast.error('Payment cancelled');
					}
				});
			} else {
				loading = false;
				toast.error('Failed to initialize payment');
			}
		}
	});

	let loading = false;
	let isRedirecting = false;
	let paymentMethod = 'apple', cardNumber = '', cardHolder = '', month = '', year = '', cvv = '', showQR = false;

	const methods = [
		{ id: 'apple', label: 'Apple Pay', icon: '/images/applePay.png', type: 'card' },
		{ id: 'paypal', label: 'PayPal', icon: '/images/paypal.png', type: 'card' },
		{ id: 'ewallet', label: 'E-Wallet', icon: '/images/ewallet.png', type: 'qr' }
	];

	$: hasFreeShipping = $checkoutStore.shipping?.price === 0;
	$: shippingCost = hasFreeShipping ? 0 : ($checkoutStore.shipping?.price as number) || STORE_CONSTANTS.SHIPPING_RATES.GOSEND;
	$: subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
	$: total = subtotal + shippingCost;
</script>

<svelte:head>
	<script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={PUBLIC_MIDTRANS_CLIENT_KEY}></script>
</svelte:head>

<div class="min-h-screen w-full bg-surface pb-20 pt-24 md:pt-32">
	<div class="mx-auto max-w-5xl px-4 sm:px-8">
	<h1 class="mb-6 text-xl font-semibold text-text-main sm:text-2xl">
		{STRINGS.CHECKOUT.TITLE}
	</h1>

	<CheckoutProgressBar activeStep={2} />

	{#if $message}
		<div class="mb-6 rounded-xl p-3 text-sm {$page.status >= 400 ? 'bg-danger-light text-danger' : 'bg-primary-light text-primary'}">
			{$message}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr,26rem] lg:gap-16">
		<div class="pt-2">
			<form method="POST" use:enhance class="space-y-5">
				<PaymentMethodSelector {methods} bind:paymentMethod bind:showQR />
				<input type="hidden" name="cartItemsJson" value={$form.cartItemsJson} />
				<input type="hidden" name="total" value={$form.total} />
				<input type="hidden" name="shippingAddress" value={$form.shippingAddress} />
				<input type="hidden" name="shippingPrice" value={$form.shippingPrice} />
				<input type="hidden" name="shippingMethod" value={$form.shippingMethod} />
				<input type="hidden" name="paymentMethod" value={$form.paymentMethod} />

				<div class="py-4 text-center">
					<img src="/images/midtrans-logo.png" alt="Midtrans" onerror="this.src='/images/applePay.png'" class="mx-auto h-16 object-contain mb-4" />
					<p class="mt-4 text-sm text-text-muted">You will be securely redirected to Midtrans to complete your payment.</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-xl bg-primary py-3 font-bold text-text-inverse transition-colors hover:bg-primary-hover disabled:opacity-50"
				>
					{loading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.PAYMENT.PAY}
				</button>
			</form>
		</div>

		<CheckoutSummary {cartItems} {subtotal} {total} {shippingCost} {hasFreeShipping} />
	</div>
	</div>
</div>

{#if isRedirecting}
	<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm transition-all duration-300">
		<div class="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
		<h2 class="mt-6 text-2xl font-bold text-text-main">Payment Successful!</h2>
		<p class="mt-2 text-text-muted">Redirecting to your order history...</p>
	</div>
{/if}
