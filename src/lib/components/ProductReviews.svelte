<script lang="ts">
	import { Star } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';

	export let reviews: {
		id: number;
		user_name: string;
		rating: number;
		comment: string;
		created_at: string;
	}[] = [];
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
			{#each reviews as review (review.id)}
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
							{#each [1, 2, 3, 4, 5] as i (i)}
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
	{/if}
</div>
