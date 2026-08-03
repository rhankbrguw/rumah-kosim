<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let show = false;
</script>

{#if show}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
		transition:fade={{ duration: 300, easing: quintOut }}
	>
		<div
			class="flex max-w-sm flex-col items-center justify-center rounded-2xl border border-gray-200 bg-surface p-8 text-center shadow-xl"
			transition:scale={{ duration: 400, start: 0.85, opacity: 0, easing: quintOut }}
		>
			<div
				class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-dark text-text-inverse ring-8 ring-surface-dark/10"
				in:scale={{ duration: 500, delay: 200, easing: quintOut, start: 0.5 }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-10 w-10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<polyline points="12 6 12 12 16 14" />
				</svg>
			</div>

			<h2 class="mb-2 text-2xl font-semibold text-text-main">Waiting for Payment</h2>
			<p class="text-sm text-text-muted">
				Your order has been saved. Redirecting to your order history where you can complete the
				payment later...
			</p>
		</div>
	</div>
{/if}
