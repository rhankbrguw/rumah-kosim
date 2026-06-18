<script lang="ts">
	import { goto } from '$app/navigation';
	import { STRINGS } from '$lib/constants/strings';
	import { formatIDR } from '$lib/utils/currency';
	import { auth } from '$lib/stores/auth';
	import { enhance } from '$app/forms';

	export let cartItems: { product_id: number, price: number, quantity: number, title: string, image: string }[] = [];

	$: subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

	function checkout() {
		if (!$auth.isAuthenticated) return goto('/client/login');
		if (cartItems.length > 0) goto('/client/checkout/address');
	}
</script>

<div class="mx-auto mt-16 min-h-screen max-w-7xl bg-surface-alt px-4 pt-8 sm:px-6 lg:px-8">
	<div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<h1 class="mb-8 text-2xl font-semibold text-text-main">{STRINGS.CART.TITLE}</h1>

			{#if cartItems.length === 0}
				<div class="py-2 text-text-muted">{STRINGS.CART.EMPTY}</div>
			{:else}
				<div class="space-y-4">
					{#each cartItems as item (item.product_id)}
						<div class="flex items-center gap-4 rounded-lg border border-surface-alt bg-surface p-4 shadow-sm">
							<img src={item.image} alt={item.title} class="h-24 w-24 rounded-md object-cover" />
							<div class="flex-1">
								<h3 class="text-lg font-medium text-text-main">{item.title}</h3>
								<div class="mt-2 flex items-center gap-4">
									<form method="POST" action="?/updateQuantity" use:enhance>
										<input type="hidden" name="productId" value={item.product_id} />
										<input type="hidden" name="delta" value="-1" />
										<button disabled={item.quantity <= 1} class="rounded border border-secondary px-2 py-1 text-sm text-text-main transition-colors hover:bg-surface-alt disabled:opacity-50">-</button>
									</form>
									<span class="text-text-muted">Quantity: {item.quantity}</span>
									<form method="POST" action="?/updateQuantity" use:enhance>
										<input type="hidden" name="productId" value={item.product_id} />
										<input type="hidden" name="delta" value="1" />
										<button class="rounded border border-secondary px-2 py-1 text-sm text-text-main transition-colors hover:bg-surface-alt disabled:opacity-50">+</button>
									</form>
								</div>
								<p class="mt-2 font-medium text-danger">{formatIDR(Number(item.price))}</p>
								<form method="POST" action="?/remove" use:enhance>
									<input type="hidden" name="productId" value={item.product_id} />
									<button class="mt-2 text-sm text-danger hover:text-danger-hover">{STRINGS.CART.REMOVE}</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if cartItems.length > 0}
			<div class="mt-8 lg:col-span-1">
				<div class="rounded-lg border border-surface-alt bg-surface p-6 shadow-sm">
					<h2 class="mb-8 text-lg font-semibold text-text-main">Order Summary</h2>
					<div class="space-y-2">
						<div class="flex justify-between text-text-muted">
							<span>Subtotal</span><span>{formatIDR(subtotal)}</span>
						</div>
						<div class="mt-2 border-t border-surface-alt pt-2">
							<div class="flex justify-between font-semibold text-text-main">
								<span>{STRINGS.CART.TOTAL}</span><span>{formatIDR(subtotal)}</span>
							</div>
						</div>
					</div>
					<button on:click={checkout} class="mt-6 w-full rounded-lg bg-primary py-3 text-text-inverse transition-colors hover:bg-primary-hover">
						{STRINGS.CART.CHECKOUT}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
