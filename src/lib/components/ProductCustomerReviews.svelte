<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	import { APP_CONFIG } from '$lib/constants/config.js';
	import { Star } from 'lucide-svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let reviews: {
		id: number;
		user_name: string;
		rating: number;
		comment: string;
		created_at: string;
	}[] = [];
	export let totalReviews: number = 0;
	export let reviewPage: number = 1;
	export let limit: number = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;

	function handlePageChange(e: CustomEvent<number>) {
		const url = new URL($page.url);
		url.searchParams.set('reviewPage', e.detail.toString());
		goto(url.toString(), { keepFocus: true });
	}
</script>

<div class="mx-auto mt-16 max-w-5xl border-t border-secondary/10 pt-12 md:mt-20 md:pt-16">
	<h2 class="mb-8 text-2xl font-bold text-text-main md:text-3xl">
		{STRINGS.PRODUCT.CUSTOMER_REVIEWS}
	</h2>

	{#if reviews.length === 0}
		<div
			class="rounded-2xl border border-secondary/10 bg-surface-alt/30 p-12 text-center text-text-muted"
		>
			{STRINGS.PRODUCT.NO_REVIEWS_YET}
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each reviews as review, _index (_index)}
				<div
					class="rounded-2xl border border-secondary/20 bg-surface/80 p-6 shadow-sm backdrop-blur-md"
				>
					<div class="mb-4 flex items-start justify-between">
						<div>
							<p class="font-bold text-text-main">{review.user_name}</p>
							<p class="text-xs text-text-muted">
								{new Date(review.created_at).toLocaleDateString()}
							</p>
						</div>
						<div class="flex text-primary">
							{#each [0, 1, 2, 3, 4] as i (i)}
								<Star
									size={14}
									fill={i < review.rating ? 'currentColor' : 'none'}
									class={i < review.rating ? 'text-primary' : 'text-secondary'}
								/>
							{/each}
						</div>
					</div>
					<p class="text-sm leading-relaxed text-text-muted">"{review.comment}"</p>
				</div>
			{/each}
		</div>
		<div class="mt-8">
			<Pagination currentPage={reviewPage} totalItems={totalReviews} itemsPerPage={limit} on:pageChange={handlePageChange} />
		</div>
	{/if}
</div>
