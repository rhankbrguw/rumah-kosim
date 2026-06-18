<script lang="ts">
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { cartStore } from '$lib/stores/cartStore';
	import { STRINGS } from '$lib/constants/strings';
	import { STORE_CONSTANTS } from '$lib/constants/config';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import CheckoutSummary from './CheckoutSummary.svelte';
	import CardForm from './CardForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number, quantity: number, title?: string, image?: string }[] = [];

	const { form, enhance, message } = superForm(data, {
		onSubmit: ({ formData, cancel }) => {
			if (!$checkoutStore.address) {
				toast.error(STRINGS.VALIDATION.ADDRESS_REQUIRED);
				cancel();
				return;
			}
			if (paymentMethod === 'credit_card') {
				if (!cardHolder || !cardNumber || !month || !year || !cvv) {
					toast.error(STRINGS.VALIDATION.FILL_ALL_DETAILS);
					cancel();
					return;
				}
				if (cardNumber.replace(/\s/g, '').length !== 16) {
					toast.error(STRINGS.VALIDATION.CARD_16_DIGITS);
					cancel();
					return;
				}
				if (cvv.length !== 3) {
					toast.error(STRINGS.VALIDATION.CVV_3_DIGITS);
					cancel();
					return;
				}
			}

			formData.set('cartItemsJson', JSON.stringify(cartItems));
			formData.set('total', total.toString());
			formData.set('shippingAddress', $checkoutStore.address);
			formData.set('shippingPrice', shippingCost.toString());
			formData.set('shippingMethod', paymentMethod);
			formData.set('paymentMethod', paymentMethod);
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				await cartStore.reset();
				checkoutStore.setAddress('');
				toast.success(STRINGS.TOAST.PAYMENT_SUCCESS);
				goto('/client/profiles');
			}
		}
	});

	let loading = false;
	let paymentMethod = 'apple',
		cardNumber = '',
		cardHolder = '',
		month = '',
		year = '',
		cvv = '',
		showQR = false;

	const methods = [
		{ id: 'apple', label: 'Apple Pay', icon: '/images/applePay.png', type: 'card' },
		{ id: 'paypal', label: 'PayPal', icon: '/images/paypal.png', type: 'card' },
		{ id: 'ewallet', label: 'E-Wallet', icon: '/images/ewallet.png', type: 'qr' }
	];

	$: hasFreeShipping = $checkoutStore.shipping?.price === 0;
	$: shippingCost = hasFreeShipping
		? 0
		: ($checkoutStore.shipping?.price as number) || STORE_CONSTANTS.SHIPPING_RATES.GOSEND;
	$: subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
	$: total = subtotal + shippingCost;
</script>

<div class="container mx-auto min-h-screen bg-surface-alt px-4 py-6 sm:mt-12">
	<h1 class="mb-4 text-xl font-bold text-text-main sm:text-2xl">
		{STRINGS.CHECKOUT.PAYMENT.TITLE}
	</h1>

	{#if $message}
		<div class="mb-4 rounded-lg bg-danger-light p-3 text-sm text-danger-hover">{$message}</div>
	{/if}

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,400px]">
		<form 
			method="POST" 
			use:enhance 
			class="rounded-lg border border-surface-alt bg-surface p-6 shadow-sm"
		>
			<div class="mb-6 flex gap-4">
				{#each methods as m}
					<button
						type="button"
						class="flex flex-1 items-center justify-center rounded-md border p-3 {paymentMethod ===
						m.id
							? 'border-primary bg-primary/5'
							: 'border-secondary hover:bg-surface-alt'} transition-colors"
						on:click={() => {
							paymentMethod = m.id;
							showQR = m.type === 'qr';
						}}
					>
						<img src={m.icon} alt={m.label} class="h-6" /><span class="ml-2 text-sm text-text-main"
							>{m.label}</span
						>
					</button>
				{/each}
			</div>

			<input type="hidden" name="cartItemsJson" value={$form.cartItemsJson} />
			<input type="hidden" name="total" value={$form.total} />
			<input type="hidden" name="shippingAddress" value={$form.shippingAddress} />
			<input type="hidden" name="shippingPrice" value={$form.shippingPrice} />
			<input type="hidden" name="shippingMethod" value={$form.shippingMethod} />
			<input type="hidden" name="paymentMethod" value={$form.paymentMethod} />

			{#if showQR}
				<div class="py-4 text-center">
					<img
						src="/images/qr-code.png"
						alt="QR"
						class="mx-auto h-40 w-40 rounded-lg border border-secondary p-2"
					/>
					<p class="mt-4 text-sm text-text-muted">{STRINGS.TOAST.SCAN_TO_PAY}</p>
					<button
						type="submit"
						disabled={loading}
						class="mt-6 w-full rounded-md bg-primary py-3 text-white hover:bg-primary-hover disabled:opacity-50"
						>{loading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.PAYMENT.PAY}</button
					>
				</div>
			{:else}
				<CardForm
					bind:cardHolder
					bind:cardNumber
					bind:month
					bind:year
					bind:cvv
					{loading}
				/>
				<button
					type="submit"
					disabled={loading}
					class="mt-6 w-full rounded-md bg-primary py-3 text-white hover:bg-primary-hover disabled:opacity-50"
				>
					{loading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.PAYMENT.PAY}
				</button>
			{/if}
		</form>

		<CheckoutSummary {cartItems} {subtotal} {total} {shippingCost} {hasFreeShipping} />
	</div>
</div>
