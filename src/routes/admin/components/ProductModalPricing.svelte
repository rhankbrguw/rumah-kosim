<script lang="ts">
	export let price: number;
	export let quantity: number;

	export let errors: Record<string, string[] | undefined>;
	export let activeTab: string;
</script>

<div class={activeTab === 'pricing' ? 'block' : 'hidden'}>
	<div class="space-y-4">
		<div>
			<label for="product-price" class="mb-1.5 block text-sm font-medium text-text-main"
				>Price (IDR)</label
			>
			<input
				id="product-price"
				name="price"
				type="number"
				class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary"
				min="0"
				bind:value={price}
			/>
			{#if errors?.price}<span class="mt-1 text-xs text-danger">{errors?.price}</span>{/if}
		</div>
		<div>
			<label for="product-quantity" class="mb-1.5 block text-sm font-medium text-text-main"
				>Stock Quantity</label
			>
			<input
				id="product-quantity"
				name="quantity"
				type="number"
				class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary"
				min="0"
				bind:value={quantity}
			/>
			{#if errors?.quantity}<span class="mt-1 text-xs text-danger">{errors?.quantity}</span>{/if}
		</div>
	</div>
</div>
