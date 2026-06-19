<script lang="ts">
	import { formatIDR } from '$lib/utils/currency';
	import { STRINGS } from '$lib/constants/strings';

	export let cartItems: { title?: string, image?: string, price: number, quantity: number }[] = [];
	export let subtotal: number = 0;
	export let total: number = 0;
	export let shippingCost: number | null = null;
	export let hasFreeShipping: boolean = false;
</script>

<div class="w-full rounded-2xl border border-secondary/10 bg-surface p-6 shadow-sm lg:p-8">
	<h2 class="mb-6 text-xl font-semibold text-text-main">{STRINGS.CART.TITLE}</h2>
	<div class="space-y-4">
		{#each cartItems as item}
			<div class="flex gap-4">
				<img
					src={item.image}
					alt={item.title}
					class="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-16"
				/>
				<div class="min-w-0 flex-1">
					<h3 class="text-sm font-medium text-text-main sm:text-base">{item.title}</h3>
					<p class="text-xs text-text-muted sm:text-sm">Qty: {item.quantity}</p>
					<p class="mt-1 text-sm font-medium text-danger">{formatIDR(Number(item.price))}</p>
				</div>
			</div>
		{/each}
	</div>
	<div class="mt-6 space-y-3 border-t border-secondary/20 pt-4 text-sm text-text-main">
		<div class="flex justify-between">
			<span class="text-text-muted">Subtotal</span>
			<span class="font-medium">{formatIDR(subtotal)}</span>
		</div>
		{#if shippingCost !== null}
			<div class="flex justify-between">
				<span class="text-text-muted">Shipping</span>
				<span class={hasFreeShipping ? 'font-medium text-primary' : 'font-medium'}>
					{hasFreeShipping ? 'FREE' : formatIDR(shippingCost)}
				</span>
			</div>
		{/if}
		<div class="flex justify-between border-t border-secondary/20 pt-3 text-base font-bold">
			<span>{STRINGS.CART.TOTAL}</span>
			<span>{formatIDR(total)}</span>
		</div>
	</div>
</div>
