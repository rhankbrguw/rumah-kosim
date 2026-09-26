<script lang="ts">
	export let price: number;
	export let quantity: number;
	export let priceError: string[] | undefined = undefined;
	export let quantityError: string[] | undefined = undefined;
</script>

<div>
	<div class="space-y-4">
		<div>
			<label for="price" class="mb-1.5 block text-sm font-medium text-text-main">Price (IDR)</label>
			<input
				id="price"
				name="price"
				type="number"
				class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary"
				min="0"
				bind:value={price}
			/>
			{#if priceError}<span class="mt-1 text-xs text-danger">{priceError}</span>{/if}
		</div>
		<div>
			<label for="quantity" class="mb-1.5 block text-sm font-medium text-text-main"
				>Stock Quantity</label
			>
			<input
				id="quantity"
				name="quantity"
				type="number"
				class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary"
				min="0"
				bind:value={quantity}
			/>
			{#if quantityError}<span class="mt-1 text-xs text-danger">{quantityError}</span>{/if}
		</div>
	</div>
</div>
