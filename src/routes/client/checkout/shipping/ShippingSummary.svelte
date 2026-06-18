<script lang="ts">
		export let cartItems: { title?: string, image?: string, price: number, quantity: number }[] = [];
	export let subtotal: number = 0;
	export let shippingOptions: { id: string, label: string, duration: string, price: number }[] = [];
	export let selectedShipping: string = '';
	export let isValidCoupon: boolean = false;
	export let couponCode: string = '';
	
	export let handleCouponSubmit: () => void;
	export let calculateTotal: () => number;
</script>

<div class="w-full lg:w-80">
	<h2 class="-mt-2 mb-4 text-xl font-semibold text-text-main sm:text-2xl">Your Cart</h2>
	<!-- Cart items -->
	<div class="mt-8 space-y-4">
		{#each cartItems as item}
			<div class="flex gap-3 sm:gap-4">
				<img
					src="/images/{item.image?.split('/').pop()}"
					alt={item.title}
					class="h-16 w-12 rounded object-cover sm:h-20 sm:w-16"
				/>
				<div>
					<h3 class="text-sm font-medium text-text-main sm:text-base">{item.title}</h3>
					<p class="text-xs text-text-muted sm:text-sm">Qty: {item.quantity}</p>
					<p class="mt-1 text-sm text-text-main sm:mt-2 sm:text-base">
						Rp {item.price.toLocaleString()}
					</p>
				</div>
			</div>
			<hr class="mb-4 mt-4 border-secondary" />
		{/each}
	</div>

	<!-- Coupon -->
	<div class="mt-6 space-y-2">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={couponCode}
				placeholder="Enter coupon code here"
				class="flex-1 rounded-lg border border-secondary bg-surface p-2 text-sm text-text-main sm:text-base"
			/>
			<button
				on:click={handleCouponSubmit}
				class="rounded-lg bg-primary px-4 py-2 text-sm text-text-inverse transition-colors hover:bg-primary-hover sm:text-base"
			>
				Apply
			</button>
		</div>
		{#if isValidCoupon}
			<p class="text-sm text-primary">Free shipping coupon applied!</p>
		{/if}
	</div>

	<!-- Totals -->
	<div class="mt-4 space-y-2 text-sm sm:text-base">
		<br />
		<hr class="mb-4 border-secondary" />
		<div class="flex justify-between text-text-main">
			<span class="text-text-muted">Subtotal</span>
			<span>Rp {subtotal.toLocaleString()}</span>
		</div>
		{#if selectedShipping}
			<div class="flex justify-between">
				<span class="text-text-muted">Shipping</span>
				<span>
					{#if isValidCoupon}
						<span class="text-primary">FREE</span>
						<span class="ml-2 text-xs text-text-muted line-through">
							Rp {shippingOptions.find((opt) => opt.id === selectedShipping)?.price.toLocaleString() || 0}
						</span>
					{:else}
						<span class="text-text-main">
							Rp {shippingOptions.find((opt) => opt.id === selectedShipping)?.price.toLocaleString() || 0}
						</span>
					{/if}
				</span>
			</div>
		{/if}
		<hr class="my-2 border-secondary" />
		<div class="flex justify-between font-medium text-text-main">
			<span>Total</span>
			<span>Rp {calculateTotal().toLocaleString()}</span>
		</div>
	</div>
</div>
