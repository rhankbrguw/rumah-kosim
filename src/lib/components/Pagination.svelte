<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let currentPage: number = 1;
	export let totalItems: number = 0;
	export let itemsPerPage: number = 20;

	const dispatch = createEventDispatcher<{ pageChange: number }>();

	$: totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
	
	// Create an array of page numbers to display, keeping current page centered if possible
	$: pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
		(p) =>
			p === 1 ||
			p === totalPages ||
			(p >= currentPage - 2 && p <= currentPage + 2)
	);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			currentPage = page;
			dispatch('pageChange', page);
		}
	}
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-center gap-2 mt-6">
		<button
			class="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-alt bg-surface text-text-main transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:not:disabled:bg-surface-alt"
			disabled={currentPage === 1}
			on:click={() => goToPage(currentPage - 1)}
			aria-label="Previous Page"
		>
			<ChevronLeft size="18" />
		</button>

		{#each pages as page, i}
			{#if i > 0 && page - pages[i - 1] > 1}
				<span class="px-2 text-text-muted">...</span>
			{/if}
			<button
				class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors {currentPage === page
					? 'bg-primary text-text-inverse shadow-sm'
					: 'border border-surface-alt bg-surface text-text-main hover:bg-surface-alt'}"
				on:click={() => goToPage(page)}
			>
				{page}
			</button>
		{/each}

		<button
			class="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-alt bg-surface text-text-main transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:not:disabled:bg-surface-alt"
			disabled={currentPage === totalPages}
			on:click={() => goToPage(currentPage + 1)}
			aria-label="Next Page"
		>
			<ChevronRight size="18" />
		</button>
	</div>
{/if}
