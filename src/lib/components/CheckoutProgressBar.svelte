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
		{#each steps as label, idx}
			<li class="flex items-center gap-2 text-sm sm:text-base">
				<span
					class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-8 sm:w-8 sm:text-sm
					{idx < activeStep
						? 'bg-primary text-text-inverse'
						: idx === activeStep
							? 'bg-text-main text-text-inverse'
							: 'bg-surface-alt text-text-muted'}"
				>
					{idx + 1}
				</span>
				<span
					class="inline text-xs font-medium tracking-tight sm:text-sm
					{idx <= activeStep ? 'text-text-main' : 'text-text-muted'}"
				>
					{label}
				</span>
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
