<script lang="ts">
		import { formatIDR } from '$lib/utils/currency';
	import { STRINGS } from '$lib/constants/strings';

	export let cartItems: { title?: string, image?: string, price: number, quantity: number }[] = [];
	export let subtotal: number = 0;
	export let total: number = 0;
	export let shippingCost: number | null = null;
	export let hasFreeShipping: boolean = false;
</script>

<div
	class="mt-8 w-full rounded-lg border border-surface-alt bg-surface-alt p-4 shadow-sm lg:mt-0 lg:w-[400px] lg:bg-transparent lg:p-6"
>
	<h2 class="mb-6 text-xl font-semibold text-text-main sm:text-2xl">{STRINGS.CART.TITLE}</h2>
	<div class="space-y-4">
		{#each cartItems as item}
			<div class="flex gap-4">
				<img
					src={item.image}
					alt={item.title}
					class="h-16 w-16 rounded object-cover sm:h-24 sm:w-20"
				/>
				<div class="min-w-0 flex-1">
					<h3 class="text-sm font-medium text-text-main sm:text-base">{item.title}</h3>
					<p class="text-xs text-text-muted sm:text-sm">Qty: {item.quantity}</p>
					<p class="mt-1 text-sm text-danger sm:mt-2">{formatIDR(Number(item.price))}</p>
				</div>
			</div>
		{/each}
	</div>
	<div class="mt-6 space-y-4 border-t border-secondary pt-4 font-medium text-text-main">
		<div class="flex justify-between">
			<span>Subtotal</span><span>{formatIDR(subtotal)}</span>
		</div>
		{#if shippingCost !== null}
			<div class="flex justify-between">
				<span>Shipping</span>
				<span class={hasFreeShipping ? 'text-primary' : ''}>
					{hasFreeShipping ? 'FREE' : formatIDR(shippingCost)}
				</span>
			</div>
		{/if}
		<div class="flex justify-between border-t border-secondary pt-4">
			<span>{STRINGS.CART.TOTAL}</span><span>{formatIDR(total)}</span>
		</div>
	</div>
</div>
