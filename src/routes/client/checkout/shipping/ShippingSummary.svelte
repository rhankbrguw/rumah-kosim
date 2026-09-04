<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { formatIDR } from '$lib/utils/currency';

	export let cartItems: { title?: string; image?: string; price: number; quantity: number }[] = [];
	export let subtotal: number = 0;
	export let shippingOptions: { id: string; label: string; duration: string; price: number }[] = [];
	export let selectedShipping: string = '';
	export let isValidCoupon: boolean = false;
	export let couponCode: string = '';

	export let handleCouponSubmit: () => void;
	export let calculateTotal: () => number;
</script>

<div
	class="w-full rounded-xl border border-surface-alt bg-surface p-4 shadow-sm sm:rounded-2xl sm:p-6"
>
	<h2 class="mb-3.5 text-base font-bold text-text-main sm:text-lg">{STRINGS.CART.TITLE}</h2>
	<div class="space-y-3">
		{#each cartItems as item, idx (idx)}
			<div class="flex gap-2.5 sm:gap-3.5">
				<div
					class="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-surface-alt bg-surface shadow-sm"
				>
					<img
						src={item.image || STRINGS.SHOP.FALLBACK_IMAGE}
						alt={item.title || 'Product'}
						class="h-full w-full object-cover transition-transform hover:scale-105"
					/>
				</div>
				<div class="min-w-0 flex-1">
					<h3 class="line-clamp-1 text-xs font-semibold text-text-main sm:text-sm">{item.title}</h3>
					<p class="text-micro text-text-muted">Qty: {item.quantity}</p>
					<p class="mt-0.5 text-xs font-bold text-primary sm:text-sm">{formatIDR(item.price)}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-4 sm:mt-5">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={couponCode}
				placeholder={STRINGS.CHECKOUT.ADDRESS.COUPON_PLACEHOLDER}
				class="flex-1 rounded-lg border border-surface-alt/70 bg-surface-alt px-3 py-2 text-xs sm:text-sm"
			/>
			<button
				type="button"
				on:click={handleCouponSubmit}
				class="cursor-pointer rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-text-inverse transition-colors hover:bg-primary-hover sm:text-sm"
			>
				{STRINGS.CHECKOUT.SHIPPING.COUPON_APPLY}
			</button>
		</div>
		{#if isValidCoupon}
			<p class="mt-1.5 text-xs font-semibold text-primary">
				{STRINGS.CHECKOUT.SHIPPING.COUPON_SUCCESS}
			</p>
		{/if}
	</div>

	<div
		class="mt-4 space-y-2.5 border-t border-surface-alt pt-3.5 text-xs text-text-main sm:text-sm"
	>
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
						<span class="text-micro ml-1.5 text-text-muted line-through">
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
		<div
			class="flex justify-between border-t border-surface-alt pt-2.5 text-sm font-bold sm:text-base"
		>
			<span>{STRINGS.CART.TOTAL}</span>
			<span class="text-primary">{formatIDR(calculateTotal())}</span>
		</div>
	</div>
</div>
