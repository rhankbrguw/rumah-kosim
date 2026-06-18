<script lang="ts">
		export let shippingOptions: { id: string, label: string, duration: string, price: number }[] = [];
	export let selectedShipping: string = '';
	export let isValidCoupon = false;
	export let handleShippingSelect;
</script>

<div class="space-y-4">
	{#each shippingOptions as option}
		<label
			class="block cursor-pointer rounded-lg border p-3 hover:border-text-main sm:p-4 {selectedShipping ===
			option.id
				? 'border-text-main bg-surface-alt'
				: 'border-secondary'}"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						type="radio"
						name="shipping"
						value={option.id}
						bind:group={selectedShipping}
						on:change={() => handleShippingSelect(option)}
						class="mr-3"
					/>
					<div>
						<div class="text-sm font-medium text-text-main sm:text-base">{option.label}</div>
						<div class="text-xs text-text-muted sm:text-sm">{option.duration}</div>
					</div>
				</div>
				<div class="text-sm font-medium">
					{#if isValidCoupon}
						<span class="text-primary">FREE</span>
						<span class="ml-2 text-xs text-text-muted line-through"
							>Rp {option.price.toLocaleString()}</span
						>
					{:else}
						<span class="text-text-main">Rp {option.price.toLocaleString()}</span>
					{/if}
				</div>
			</div>
		</label>
	{/each}
</div>
