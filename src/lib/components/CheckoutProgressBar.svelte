<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';

	export let activeStep: number = 0;

	const steps = [
		STRINGS.CHECKOUT.STEPS.ADDRESS,
		STRINGS.CHECKOUT.STEPS.SHIPPING,
		STRINGS.CHECKOUT.STEPS.PAYMENT
	];
</script>

<nav class="mb-8" aria-label="Checkout progress">
	<ol class="flex items-center">
		{#each steps as label, idx (label)}
			<li class="flex items-center gap-2 text-sm sm:text-base">
				{#if idx < activeStep}
					<a
						href="/client/checkout/{idx === 0 ? 'address' : idx === 1 ? 'shipping' : 'payment'}"
						class="flex items-center gap-2 transition-opacity hover:opacity-80"
					>
						<span
							class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-xs font-bold text-text-inverse shadow-sm transition-colors hover:scale-105 sm:h-8 sm:w-8 sm:text-sm"
						>
							{idx + 1}
						</span>
						<span
							class="inline cursor-pointer text-xs font-medium tracking-tight text-text-main hover:underline sm:text-sm"
						>
							{label}
						</span>
					</a>
				{:else}
					<div class="flex items-center gap-2">
						<span
							class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-8 sm:w-8 sm:text-sm
							{idx === activeStep
								? 'bg-text-main text-text-inverse shadow-md'
								: 'border border-secondary/20 bg-surface-alt text-text-muted'}"
						>
							{idx + 1}
						</span>
						<span
							class="inline text-xs font-medium tracking-tight sm:text-sm
							{idx === activeStep ? 'font-bold text-text-main' : 'text-text-muted'}"
						>
							{label}
						</span>
					</div>
				{/if}
			</li>
			{#if idx < steps.length - 1}
				<div
					class="mx-2 h-px flex-1 transition-colors sm:mx-4
					{idx < activeStep ? 'bg-primary' : 'bg-secondary'}"
				></div>
			{/if}
		{/each}
	</ol>
</nav>
