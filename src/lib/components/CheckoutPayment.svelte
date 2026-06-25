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
	import { Lock } from 'lucide-svelte';

	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number, quantity: number, title?: string, image?: string }[] = [];

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
			formData.set('shippingMethod', $checkoutStore.shipping?.method || 'GOSEND');
		},
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.form?.message?.snapToken) {
				const snapToken = result.data.form.message.snapToken;
				
				// @ts-ignore - Midtrans snap global
				window.snap.pay(snapToken, {
					onSuccess: async () => { isRedirecting = true; await cartStore.reset(); checkoutStore.reset(); toast.success(STRINGS.TOAST.PAYMENT_SUCCESS); setTimeout(() => goto('/client/profile/history'), 2000); },
					onPending: async () => { await cartStore.reset(); checkoutStore.reset(); toast.success('Order placed. Waiting for payment!'); setTimeout(() => goto('/client/profile/history'), 2000); },
					onError: () => { loading = false; toast.error('Payment failed!'); },
					onClose: () => { loading = false; toast.error('Payment cancelled'); }
				});
			} else {
				loading = false;
				toast.error(typeof result.data?.form?.message === 'string' ? result.data.form.message : result.data?.form?.message?.text || 'Failed to initialize payment');
			}
		}
	});

	let loading = false;
	let isRedirecting = false;

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
				<input type="hidden" name="cartItemsJson" value={$form.cartItemsJson} /><input type="hidden" name="total" value={$form.total} />
				<input type="hidden" name="shippingAddress" value={$form.shippingAddress} /><input type="hidden" name="shippingPrice" value={$form.shippingPrice} />
				<input type="hidden" name="shippingMethod" value={$form.shippingMethod} />

				<div class="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-surface-alt/40 to-surface/40 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_-15px_rgba(var(--color-primary),0.3)]">
					<div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-transform duration-500 group-hover:scale-150"></div>
					<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/10 blur-3xl transition-transform duration-500 group-hover:scale-150"></div>
					
					<div class="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/30">
						<Lock size={28} class="text-secondary" />
					</div>
					
					<h3 class="mb-2 text-lg font-bold text-text-main">{STRINGS.CHECKOUT.PAYMENT.SECURE_GATEWAY_TITLE}</h3>
					<p class="mb-6 text-sm leading-relaxed text-text-muted">{STRINGS.CHECKOUT.PAYMENT.SECURE_GATEWAY_DESC}</p>
					
					<div class="relative z-10 flex items-center justify-center gap-3 rounded-xl bg-surface/50 py-3 backdrop-blur-md">
						<span class="font-bold text-primary">Powered by Midtrans</span>
						<div class="h-4 w-[1px] bg-border-color"></div>
						<span class="text-xs font-semibold uppercase tracking-wider text-text-main">Global Security Standard</span>
					</div>
				</div>

				<button type="submit" disabled={loading} class="group relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary py-4 font-bold text-secondary shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 active:translate-y-0 disabled:opacity-70">
					<div class="absolute inset-0 translate-y-[100%] bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 group-hover:translate-y-0"></div>
					{#if loading}
						<div class="relative z-10 h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent"></div><span class="relative z-10">{STRINGS.COMMON.LOADING}</span>
					{:else}
						<span class="relative z-10">{STRINGS.CHECKOUT.PAYMENT.PAY}</span><div class="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 transition-transform group-hover:translate-x-1">&rarr;</div>
					{/if}
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
		<h2 class="mt-6 text-2xl font-bold text-text-main">{STRINGS.CHECKOUT.PAYMENT.REDIRECT_SUCCESS}</h2>
		<p class="mt-2 text-text-muted">{STRINGS.CHECKOUT.PAYMENT.REDIRECT_DESC}</p>
	</div>
{/if}
