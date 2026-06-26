<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { formatIDR } from '$lib/utils/currency';

	export let cartItems: { title?: string, image?: string, price: number, quantity: number }[] = [];
	export let subtotal: number = 0;
	export let shippingOptions: { id: string, label: string, duration: string, price: number }[] = [];
	export let selectedShipping: string = '';
	export let isValidCoupon: boolean = false;
	export let couponCode: string = '';

	export let handleCouponSubmit: () => void;
	export let calculateTotal: () => number;
</script>

<div class="w-full rounded-2xl border border-secondary/10 bg-surface p-6 shadow-sm lg:p-8">
	<h2 class="mb-4 text-xl font-semibold text-text-main">{STRINGS.CART.TITLE}</h2>
	<div class="space-y-4">
		{#each cartItems as item}
			<div class="flex gap-3 sm:gap-4">
				<div class="h-16 w-16 overflow-hidden rounded-lg border border-secondary/20 bg-surface shadow-sm">
					<img
						src={item.image || STRINGS.SHOP.FALLBACK_IMAGE}
						alt={item.title || 'Product'}
						class="h-full w-full object-cover transition-transform hover:scale-105"
					/>
				</div>
				<div class="min-w-0 flex-1">
					<h3 class="text-sm font-medium text-text-main sm:text-base">{item.title}</h3>
					<p class="text-xs text-text-muted sm:text-sm">Qty: {item.quantity}</p>
					<p class="mt-1 text-sm font-medium text-danger">{formatIDR(item.price)}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-6">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={couponCode}
				placeholder={STRINGS.CHECKOUT.ADDRESS.COUPON_PLACEHOLDER}
				class="flex-1 rounded-lg border border-secondary/20 bg-surface-alt px-3 py-2 text-sm"
			/>
			<button
				type="button"
				on:click={handleCouponSubmit}
				class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover"
			>
				{STRINGS.CHECKOUT.SHIPPING.COUPON_APPLY}
			</button>
		</div>
		{#if isValidCoupon}
			<p class="mt-2 text-sm font-medium text-primary">{STRINGS.CHECKOUT.SHIPPING.COUPON_SUCCESS}</p>
		{/if}
	</div>

	<div class="mt-4 space-y-3 border-t border-secondary/20 pt-4 text-sm text-text-main">
		<div class="flex justify-between">
			<span class="text-text-muted">Subtotal</span>
			<span class="font-medium">{formatIDR(subtotal)}</span>
		</div>
		{#if selectedShipping}
			<div class="flex justify-between">
				<span class="text-text-muted">Shipping</span>
				<span>
					{#if isValidCoupon}
						<span class="font-medium text-primary">FREE</span>
						<span class="ml-2 text-xs text-text-muted line-through">
							{formatIDR(shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0)}
						</span>
					{:else}
						<span class="font-medium">
							{formatIDR(shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0)}
						</span>
					{/if}
				</span>
			</div>
		{/if}
		<div class="flex justify-between border-t border-secondary/20 pt-3 text-base font-bold">
			<span>{STRINGS.CART.TOTAL}</span>
			<span>{formatIDR(calculateTotal())}</span>
		</div>
	</div>
</div>
