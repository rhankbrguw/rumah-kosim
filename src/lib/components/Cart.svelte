<script lang="ts">
	import { goto } from '$app/navigation';
	import { STRINGS } from '$lib/constants/strings';
	import { formatIDR } from '$lib/utils/currency';
	import { auth } from '$lib/stores/auth';
	import { enhance } from '$app/forms';
	import { Trash2 } from 'lucide-svelte';

	export let cartItems: { product_id: number, price: number, quantity: number, title: string, image: string }[] = [];

	$: subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

	function checkout() {
		if (!$auth.isAuthenticated) return goto('/client/auth');
		if (cartItems.length > 0) goto('/client/checkout/address');
	}
	let isSubmitting = false;

	const handleForm = () => {
		isSubmitting = true;
		return async ({ update }: { update: any }) => {
			await update();
			isSubmitting = false;
		};
	};
</script>

<div class="mx-auto mt-16 min-h-screen max-w-7xl bg-surface-alt px-4 pt-8 sm:px-6 lg:px-8">
	<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
		<div class="lg:col-span-7">
			<h1 class="mb-8 text-2xl font-semibold text-text-main">{STRINGS.CART.TITLE}</h1>

			{#if cartItems.length === 0}
				<div class="py-2 text-text-muted">{STRINGS.CART.EMPTY}</div>
			{:else}
				<div class="divide-y divide-secondary/10">
					{#each cartItems as item (item.product_id)}
						<div class="flex gap-4 py-6">
							<img src={item.image} alt={item.title} class="h-20 w-20 shrink-0 rounded-md object-cover sm:h-24 sm:w-24" />
							<div class="flex flex-1 flex-col justify-between">
								<div>
									<div class="flex items-start justify-between">
										<h3 class="text-base font-medium text-text-main sm:text-lg">{item.title}</h3>
										<form method="POST" action="?/remove" use:enhance={handleForm}>
											<input type="hidden" name="productId" value={item.product_id} />
											<button 
												type="submit" 
												disabled={isSubmitting}
												class="text-danger transition-colors hover:text-danger-hover disabled:opacity-50" 
												aria-label={STRINGS.CART.REMOVE} 
												title={STRINGS.CART.REMOVE}
											>
												<Trash2 size={20} />
											</button>
										</form>
									</div>
									<p class="mt-1 font-bold text-danger sm:mt-2">{formatIDR(Number(item.price))}</p>
								</div>
								<div class="mt-3 flex items-center gap-3 sm:mt-4 sm:gap-4">
									<form method="POST" action="?/updateQuantity" use:enhance={handleForm}>
										<input type="hidden" name="productId" value={item.product_id} />
										<input type="hidden" name="delta" value="-1" />
										<button disabled={item.quantity <= 1 || isSubmitting} class="rounded border border-secondary px-2 py-1 text-sm text-text-main transition-colors hover:bg-surface-alt disabled:opacity-50">-</button>
									</form>
									<span class="text-sm font-medium text-text-muted sm:text-base">Quantity: {item.quantity}</span>
									<form method="POST" action="?/updateQuantity" use:enhance={handleForm}>
										<input type="hidden" name="productId" value={item.product_id} />
										<input type="hidden" name="delta" value="1" />
										<button disabled={isSubmitting} class="rounded border border-secondary px-2 py-1 text-sm text-text-main transition-colors hover:bg-surface-alt disabled:opacity-50">+</button>
									</form>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if cartItems.length > 0}
			<div class="mt-8 lg:col-span-5 lg:mt-0">
				<div class="sticky top-24 rounded-2xl border border-secondary/10 bg-surface p-6 shadow-sm">
					<h2 class="mb-6 text-xl font-bold text-text-main">Order Summary</h2>
					<div class="space-y-4 text-sm text-text-muted">
						<div class="flex justify-between">
							<span>Subtotal ({cartItems.length} {cartItems.length > 1 ? 'items' : 'item'})</span>
							<span class="font-medium text-text-main">{formatIDR(subtotal)}</span>
						</div>
						<div class="flex justify-between">
							<span>Estimated Shipping</span>
							<span class="text-text-main">Calculated at checkout</span>
						</div>
						<div class="flex justify-between">
							<span>Estimated Tax</span>
							<span class="text-text-main">Calculated at checkout</span>
						</div>
						
						<div class="my-4 border-t border-surface-alt"></div>
						
						<div class="flex justify-between text-base font-bold text-text-main">
							<span>{STRINGS.CART.TOTAL}</span>
							<span class="text-primary">{formatIDR(subtotal)}</span>
						</div>
					</div>
					<button on:click={checkout} class="mt-8 w-full rounded-lg bg-primary py-3.5 font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus:ring-4 focus:ring-primary/20">
						{STRINGS.CART.CHECKOUT}
					</button>
					
					<p class="mt-4 text-center text-xs text-text-muted">
						Taxes and shipping calculated at checkout
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
