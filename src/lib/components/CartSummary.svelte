<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { ArrowRight, ShieldCheck, PackageCheck, Zap } from 'lucide-svelte';

	export let subtotal = 0;
	export let itemCount = 0;

	const dispatch = createEventDispatcher<{ checkout: void }>();
</script>

<div
	class="sticky top-24 rounded-2xl border border-surface-alt bg-surface p-5 shadow-sm transition-all sm:p-6"
>
	<div class="mb-4 flex items-center justify-between sm:mb-5">
		<h2 class="text-base font-bold text-text-main sm:text-lg">
			{STRINGS.CART.ORDER_SUMMARY}
		</h2>
		<span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
			{itemCount}
			{itemCount > 1 ? STRINGS.CART.ITEMS : STRINGS.CART.ITEM}
		</span>
	</div>

	<div class="space-y-3 text-xs text-text-muted sm:text-sm">
		<div class="flex items-center justify-between">
			<span>{STRINGS.CART.SUBTOTAL}</span>
			<span class="font-medium text-text-main">{formatIDR(subtotal)}</span>
		</div>
		<div class="flex items-center justify-between">
			<span>{STRINGS.CART.ESTIMATED_SHIPPING}</span>
			<span class="text-compact font-medium text-text-muted">
				{STRINGS.CART.CALCULATED_AT_CHECKOUT}
			</span>
		</div>
		<div class="border-t border-surface-alt pt-3">
			<div class="flex items-baseline justify-between">
				<span class="text-sm font-bold text-text-main sm:text-base">{STRINGS.CART.TOTAL}</span>
				<div class="text-right">
					<span class="text-lg font-extrabold text-primary sm:text-xl">{formatIDR(subtotal)}</span>
					<p class="text-micro mt-0.5 text-text-muted">{STRINGS.CART.CHECKOUT_NOTE}</p>
				</div>
			</div>
		</div>
	</div>

	<button
		type="button"
		on:click={() => dispatch('checkout')}
		class="group mt-5 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-text-inverse shadow-sm transition-all hover:bg-primary-hover hover:shadow focus-visible:outline-2 active:scale-[0.99] sm:text-sm"
	>
		<span>{STRINGS.CART.CHECKOUT}</span>
		<ArrowRight size={16} class="transition-transform group-hover:translate-x-0.5" />
	</button>

	<div class="mt-6 space-y-2.5 border-t border-surface-alt pt-5 text-xs text-text-muted">
		<div class="flex items-center gap-2">
			<ShieldCheck size={14} class="shrink-0 text-primary" />
			<span class="text-compact font-medium text-text-main">{STRINGS.CART.TRUST_AUTHENTIC}</span>
		</div>
		<div class="flex items-center gap-2">
			<PackageCheck size={14} class="shrink-0 text-primary" />
			<span class="text-compact font-medium text-text-main">{STRINGS.CART.TRUST_PACKAGING}</span>
		</div>
		<div class="flex items-center gap-2">
			<Zap size={14} class="shrink-0 text-primary" />
			<span class="text-compact font-medium text-text-main">{STRINGS.CART.TRUST_DISPATCH}</span>
		</div>
	</div>
</div>
