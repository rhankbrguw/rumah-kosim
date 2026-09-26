<script lang="ts">
	export let shippingOptions: { id: string; label: string; duration: string; price: number }[] = [];
	export let selectedShipping: string = '';
	export let isValidCoupon = false;
	export let handleShippingSelect: (option: {
		id: string;
		label: string;
		duration: string;
		price: number;
	}) => void;
</script>

<div class="space-y-2.5 sm:space-y-3">
	{#each shippingOptions as option (option.id)}
		<label
			class="block cursor-pointer rounded-xl border p-3 transition-all sm:p-4
			{selectedShipping === option.id
				? 'border-primary bg-primary/10 shadow-sm'
				: 'border-surface-alt/70 hover:border-primary/40'}"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2.5 sm:gap-3">
					<input
						type="radio"
						name="shipping"
						value={option.id}
						bind:group={selectedShipping}
						on:change={() => handleShippingSelect(option)}
						class="text-primary focus:ring-primary"
					/>
					<div>
						<div class="text-xs font-semibold text-text-main sm:text-sm">{option.label}</div>
						<div class="text-micro text-text-muted sm:text-xs">{option.duration}</div>
					</div>
				</div>
				<div class="text-xs font-bold sm:text-sm">
					{#if isValidCoupon}
						<span class="text-primary">FREE</span>
						<span class="text-micro ml-1 text-text-muted line-through">
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
