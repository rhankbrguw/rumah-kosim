<script lang="ts">
	import { X } from 'lucide-svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
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
	export let contentClass = 'p-4 sm:p-6';

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showClose) close();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			close();
		}
	}

	$: if (typeof document !== 'undefined') {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 overflow-y-auto bg-secondary/70 px-3 pb-6 pt-14 backdrop-blur-sm sm:px-4 sm:py-8"
		style="padding-top: max(3.5rem, calc(env(safe-area-inset-top, 0px) + 1.25rem)); padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 0px));"
		role="presentation"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
	>
		<div
			class="flex min-h-full items-center justify-center py-2 sm:py-6"
			role="presentation"
			on:click={handleBackdropClick}
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
					<div
						class="flex shrink-0 items-center justify-between gap-3 border-b border-surface-alt px-3.5 py-3 sm:px-5 sm:py-4"
					>
						<h2 id={labelledBy} class="truncate text-sm font-bold text-text-main sm:text-base">
							{title}
						</h2>
						{#if showClose}
							<button
								type="button"
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-text-muted transition-colors hover:bg-surface-alt/80 hover:text-text-main focus:outline-none focus:ring-2 focus:ring-primary sm:h-9 sm:w-9"
								aria-label={STRINGS.COMMON.CLOSE}
								on:click={close}
							>
								<X size={16} />
							</button>
						{/if}
					</div>
				{:else if showClose}
					<button
						type="button"
						class="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-alt text-text-muted transition-colors hover:bg-surface-alt/80 hover:text-text-main focus:outline-none focus:ring-2 focus:ring-primary sm:right-3 sm:top-3 sm:h-9 sm:w-9"
						aria-label={STRINGS.COMMON.CLOSE}
						on:click={close}
					>
						<X size={16} />
					</button>
				{/if}
				<div class={contentClass}>
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
