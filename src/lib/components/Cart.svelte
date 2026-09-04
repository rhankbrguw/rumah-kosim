<script lang="ts">
	import { goto } from '$app/navigation';
	import { STRINGS } from '$lib/constants/strings.js';
	import { auth } from '$lib/stores/auth.js';
	import type { CartItem } from '$lib/stores/cartStore.js';
	import { ArrowLeft, BookOpen } from 'lucide-svelte';
	import CartSummary from './CartSummary.svelte';
	import CartItemRow from './CartItemRow.svelte';

	export let cartItems: CartItem[] = [];

	$: subtotal = cartItems.reduce(
		(sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
		0
	);

	function checkout() {
		if (!$auth.isAuthenticated) return goto('/client/auth');
		if (cartItems.length > 0) goto('/client/checkout/address');
	}

	let isSubmitting = false;

	const handleForm = () => {
		isSubmitting = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isSubmitting = false;
		};
	};
</script>

<div
	class="page-enter mx-auto mt-12 min-h-screen max-w-7xl px-3.5 pb-16 pt-6 sm:mt-16 sm:px-6 lg:px-8"
>
	<div class="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
				{STRINGS.CART.TITLE}
			</h1>
			<p class="text-xs text-text-muted sm:text-sm">{STRINGS.CART.SUBTITLE}</p>
		</div>
		<a
			href="/client/shop"
			class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary-hover sm:text-sm"
		>
			<ArrowLeft size={14} />
			<span>{STRINGS.CART.CONTINUE_SHOPPING}</span>
		</a>
	</div>

	{#if cartItems.length === 0}
		<div class="rounded-2xl border border-surface-alt bg-surface p-8 text-center shadow-sm sm:p-14">
			<div
				class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
			>
				<BookOpen size={28} />
			</div>
			<h2 class="mt-4 text-base font-bold text-text-main sm:text-lg">{STRINGS.CART.EMPTY}</h2>
			<p class="mx-auto mt-1 max-w-md text-xs text-text-muted sm:text-sm">
				{STRINGS.CART.EMPTY_SUBTITLE}
			</p>
			<a
				href="/client/shop"
				class="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-text-inverse shadow-sm transition-all hover:bg-primary-hover hover:shadow active:scale-95 sm:text-sm"
			>
				<span>{STRINGS.CART.DISCOVER_BOOKS}</span>
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
			<div class="space-y-3.5 lg:col-span-7">
				{#each cartItems as item (item.product_id)}
					<CartItemRow {item} {isSubmitting} {handleForm} />
				{/each}
			</div>

			<div class="lg:col-span-5">
				<CartSummary {subtotal} itemCount={cartItems.length} on:checkout={checkout} />
			</div>
		</div>
	{/if}
</div>
