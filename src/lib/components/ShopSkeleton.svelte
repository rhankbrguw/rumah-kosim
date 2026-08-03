<script lang="ts">
</script>

{#each Array(8) as i}
	<div
		data-skeleton={i}
		class="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-alt/50 bg-surface/70 shadow-sm backdrop-blur-md"
	>
		<div class="aspect-[4/5] w-full animate-pulse bg-surface-alt/80"></div>
		<div class="flex flex-1 flex-col p-4 sm:p-5">
			<div class="mb-2 h-5 w-3/4 animate-pulse rounded bg-surface-alt"></div>
			<div class="mb-4 h-4 w-1/2 animate-pulse rounded bg-surface-alt"></div>
			<div class="mt-auto h-10 w-full animate-pulse rounded-xl bg-surface-alt"></div>
		</div>
	</div>
{/each}
