<script lang="ts">
	export let shippingOptions: { id: string, label: string, duration: string, price: number }[] = [];
	export let selectedShipping: string = '';
	export let isValidCoupon = false;
	export let handleShippingSelect: (option: { id: string, label: string, duration: string, price: number }) => void;
</script>

<div class="space-y-3">
	{#each shippingOptions as option}
		<label
			class="block cursor-pointer rounded-xl border-2 p-4 transition-all
			{selectedShipping === option.id
				? 'border-primary bg-primary-light shadow-sm'
				: 'border-secondary/20 hover:border-primary/40'}"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<input
						type="radio"
						name="shipping"
						value={option.id}
						bind:group={selectedShipping}
						on:change={() => handleShippingSelect(option)}
						class="text-primary focus:ring-primary"
					/>
					<div>
						<div class="text-sm font-medium text-text-main sm:text-base">{option.label}</div>
						<div class="text-xs text-text-muted sm:text-sm">{option.duration}</div>
					</div>
				</div>
				<div class="text-sm font-bold">
					{#if isValidCoupon}
						<span class="text-primary">FREE</span>
						<span class="ml-1 text-xs text-text-muted line-through">
							Rp {option.price.toLocaleString()}
						</span>
					{:else}
						<span class="text-text-main">Rp {option.price.toLocaleString()}</span>
					{/if}
				</div>
			</div>
		</label>
	{/each}
</div>
