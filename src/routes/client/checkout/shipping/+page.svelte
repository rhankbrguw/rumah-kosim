<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { STRINGS } from '$lib/constants/strings';
	import { STORE_CONSTANTS } from '$lib/constants/config';
	import ShippingSummary from './ShippingSummary.svelte';
	import ShippingOptionsForm from './ShippingOptionsForm.svelte';
	import CheckoutProgressBar from '$lib/components/CheckoutProgressBar.svelte';

	export let data: any;

	let selectedShipping = '';
	$: cartItems = data.cartItems;
	$: subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

	let couponCode = '';
	let isValidCoupon = false;

	const shippingOptions = [
		{
			id: 'gosend',
			label: 'Go-send',
			duration: '4-7 Business Days',
			price: STORE_CONSTANTS.SHIPPING_RATES.GOSEND
		},
		{
			id: 'jne',
			label: 'JNE',
			duration: '3-5 Business Days',
			price: STORE_CONSTANTS.SHIPPING_RATES.JNE
		}
	];

	function handleShippingSelect(option: { id: string, label: string, duration: string, price: number }) {
		selectedShipping = option.id;
		checkoutStore.setShipping({
			...option,
			price: isValidCoupon ? 0 : option.price
		});
	}

	function validateCoupon(code: string) {
		isValidCoupon = code.toUpperCase() === STORE_CONSTANTS.PROMO_SHIPPING_CODE;
		if (isValidCoupon && selectedShipping) {
			const currentShipping = shippingOptions.find((opt) => opt.id === selectedShipping);
			checkoutStore.setShipping({ ...currentShipping, price: 0 });
		}
		return isValidCoupon;
	}

	function handleCouponSubmit() {
		if (validateCoupon(couponCode)) {
			if (selectedShipping) calculateTotal();
		} else {
			toast.error(STRINGS.TOAST.INVALID_COUPON);
			couponCode = '';
		}
	}

	function calculateTotal() {
		const shipping = selectedShipping
			? shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0
			: 0;
		return subtotal + (isValidCoupon ? 0 : shipping);
	}

	async function handleContinue() {
		if (!selectedShipping) {
			toast.error(STRINGS.TOAST.SHIPPING_METHOD_REQUIRED);
			return;
		}
		await goto('/client/checkout/payment');
	}
</script>

<div class="min-h-screen w-full bg-surface pb-20 pt-24 md:pt-32">
	<div class="mx-auto max-w-5xl px-4 sm:px-8">
	<h1 class="mb-6 text-xl font-semibold text-text-main sm:text-2xl">
		{STRINGS.CHECKOUT.TITLE}
	</h1>

	<CheckoutProgressBar activeStep={1} />

	<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr,26rem] lg:gap-16">
		<div class="pt-2">
				<ShippingOptionsForm
					{shippingOptions}
					bind:selectedShipping
					{isValidCoupon}
					{handleShippingSelect}
				/>

			<form method="POST" action="?/saveShipping" use:enhance>
				<input type="hidden" name="shippingMethod" value={selectedShipping} />
				<input type="hidden" name="shippingPrice" value={isValidCoupon ? 0 : (shippingOptions.find(o => o.id === selectedShipping)?.price || 0)} />
				<button
					type="submit"
					on:click={handleContinue}
					class="mt-6 w-full rounded-xl bg-primary py-3 font-bold text-text-inverse transition-colors hover:bg-primary-hover"
				>
					{STRINGS.CHECKOUT.SHIPPING.CONTINUE}
				</button>
			</form>
		</div>

		<ShippingSummary
			{cartItems}
			{subtotal}
			{shippingOptions}
			{selectedShipping}
			bind:isValidCoupon
			bind:couponCode
			{handleCouponSubmit}
			{calculateTotal}
		/>
	</div>
	</div>
</div>
