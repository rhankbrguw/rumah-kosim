<script lang="ts">
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { STRINGS } from '$lib/constants/strings.js';

	export let isOpen = true;
	export let title = '';
	export let role: 'dialog' | 'alertdialog' = 'dialog';
	export let labelledBy = 'modal-title';
	export let describedBy = '';
	export let ariaLabel = '';
	export let showClose = true;
	export let closeOnBackdrop = true;
	export let panelClass = '';
	export let maxWidthClass = 'max-w-lg';
	export let contentClass = 'p-5 sm:p-6';

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showClose) close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-secondary/70 p-4 backdrop-blur-sm"
		role="presentation"
		transition:fade={{ duration: 150 }}
		on:click={(event) => closeOnBackdrop && event.target === event.currentTarget && close()}
	>
		<div
			class={`relative w-full ${maxWidthClass} rounded-2xl border border-surface-alt bg-surface shadow-2xl ${panelClass}`}
			{role}
			aria-modal="true"
			aria-labelledby={labelledBy}
			aria-describedby={describedBy || undefined}
			aria-label={ariaLabel || undefined}
			tabindex="-1"
			transition:scale={{ duration: 150, start: 0.96 }}
		>
			{#if title}
				<div class="flex items-start justify-between gap-4 border-b border-surface-alt p-5 sm:p-6">
					<h2 id={labelledBy} class="text-lg font-bold text-text-main">{title}</h2>
					{#if showClose}
						<button
							type="button"
							class="min-h-11 min-w-11 rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
							aria-label={STRINGS.COMMON.CLOSE}
							on:click={close}
						>
							<X size={18} />
						</button>
					{/if}
				</div>
			{:else if showClose}
				<button
					type="button"
					class="absolute right-3 top-3 z-10 min-h-11 min-w-11 rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-main focus:outline-none focus:ring-2 focus:ring-primary"
					aria-label={STRINGS.COMMON.CLOSE}
					on:click={close}
				>
					<X size={18} />
				</button>
			{/if}
			<div class={contentClass}>
				<slot />
			</div>
		</div>
	</div>
{/if}
