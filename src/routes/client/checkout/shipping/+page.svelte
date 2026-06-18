<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { toast } from 'svelte-sonner';
	import { STORE_CONSTANTS } from '$lib/constants/config';
	import ShippingSummary from './ShippingSummary.svelte';
	import ShippingOptionsForm from './ShippingOptionsForm.svelte';

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
			price: isValidCoupon ? 0 : option.price // Apply free shipping if valid coupon
		});
	}

	function validateCoupon(code: string) {
		// Check for the specific promotional code from the modal
		isValidCoupon = code.toUpperCase() === STORE_CONSTANTS.PROMO_SHIPPING_CODE;

		// If shipping is already selected, update it with free shipping
		if (isValidCoupon && selectedShipping) {
			const currentShipping = shippingOptions.find((opt) => opt.id === selectedShipping);
			checkoutStore.setShipping({
				...currentShipping,
				price: 0
			});
		}

		return isValidCoupon;
	}

	function handleCouponSubmit() {
		if (validateCoupon(couponCode)) {
			// Update the total if shipping is already selected
			if (selectedShipping) {
				calculateTotal();
			}
		} else {
			toast.error('Invalid coupon code');
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
			toast.error('Please select a shipping method');
			return;
		}
		await goto('/client/checkout/payment');
	}
</script>

<div class="mx-auto mt-20 max-w-5xl px-4 py-6 sm:px-8">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,auto] lg:gap-16">
		<!-- Left column -->
		<div>
			<h1 class="mb-6 text-xl font-semibold text-text-main sm:text-2xl">Checkout</h1>

			<!-- Progress -->
			<div class="mb-8 flex items-center text-sm sm:text-base">
				<span class="text-text-muted">Address</span>
				<div class="mx-2 flex-1 border-t border-secondary sm:mx-4"></div>
				<span class="font-medium text-text-main">Shipping</span>
				<div class="mx-2 flex-1 border-t border-secondary sm:mx-4"></div>
				<span class="text-text-muted">Payment</span>
			</div>

			<ShippingOptionsForm
				{shippingOptions}
				bind:selectedShipping
				{isValidCoupon}
				{handleShippingSelect}
			/>

			<button
				on:click={handleContinue}
				class="mt-6 w-full rounded-lg bg-text-main py-2 text-text-inverse transition-colors hover:bg-text-muted sm:py-3"
			>
				Continue to payment
			</button>
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
