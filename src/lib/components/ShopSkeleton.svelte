<script lang="ts">
</script>

{#each Array(8) as _, idx (idx)}
	<div
		class="flex h-full flex-col overflow-hidden rounded-xl border border-surface-alt/60 bg-surface/90 shadow-sm sm:rounded-2xl"
	>
		<div class="aspect-[4/5] w-full animate-pulse bg-surface-alt/80"></div>
		<div class="flex flex-1 flex-col p-3 sm:p-4">
			<div class="mb-2 h-4 w-4/5 animate-pulse rounded bg-surface-alt"></div>
			<div class="mb-3 h-3.5 w-2/5 animate-pulse rounded bg-surface-alt"></div>
			<div class="mt-auto h-7 w-full animate-pulse rounded-lg bg-surface-alt sm:h-8"></div>
		</div>
	</div>
{/each}
