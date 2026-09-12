<script lang="ts">
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import ModalShell from './ModalShell.svelte';
	import { STRINGS } from '$lib/constants/strings.js';

	export let show = false;
</script>

{#if show}
	<ModalShell isOpen={show} title={STRINGS.CHECKOUT.PAYMENT.PENDING_TITLE} showClose={false}>
		<div class="flex flex-col items-center text-center">
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

			<p class="text-sm text-text-muted">
				{STRINGS.CHECKOUT.PAYMENT.PENDING_DESCRIPTION}
			</p>
		</div>
	</ModalShell>
{/if}
