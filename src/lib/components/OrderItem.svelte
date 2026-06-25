<script lang="ts">
	import { StarIcon, MessageCircle } from 'lucide-svelte';
	import { formatIDR } from '$lib/utils/currency';
	import { STRINGS } from '$lib/constants/strings';

	export let item: { product_id: number, title: string, image: string, price_at_time: number, quantity: number, reviewed?: boolean, review?: { comment: string, rating?: number } };
	export let orderStatus: string;
	export let orderId: number;
	export let openReviewModal: (item: { id: number, title: string, image: string, orderId: number }) => void;
</script>

<div class="flex flex-col gap-4 rounded-xl border border-secondary/20 bg-surface-alt/30 p-4 shadow-sm transition-all hover:bg-surface-alt/50 sm:flex-row sm:items-center">
	<img src={item.image || STRINGS.SHOP.FALLBACK_IMAGE} alt={item.title} class="h-20 w-20 rounded-lg object-cover shadow-sm" />
	
	<div class="flex flex-1 flex-col justify-between gap-3">
		<div class="flex flex-col justify-between sm:flex-row sm:items-start gap-4">
			<div>
				<h5 class="font-bold text-text-main line-clamp-2">{item.title}</h5>
				<p class="mt-1 text-sm font-medium text-text-muted">
					{item.quantity} × {formatIDR(item.price_at_time)}
				</p>
			</div>
		</div>

		{#if orderStatus === 'Delivered'}
			<div class="mt-1 border-t border-secondary/10 pt-3">
				{#if item.reviewed}
					<div class="flex flex-col gap-1.5 rounded-lg bg-surface/50 p-3">
						<div class="flex items-center gap-1 text-primary">
							{#each Array(5) as _, i}
								<StarIcon size={14} fill={i < (item.review?.rating || 5) ? 'currentColor' : 'none'} class={i < (item.review?.rating || 5) ? 'text-primary' : 'text-secondary'} />
							{/each}
							<span class="ml-2 text-xs font-bold text-text-main">Reviewed</span>
						</div>
						<div class="flex items-start gap-2 text-sm text-text-muted">
							<MessageCircle size={14} class="mt-0.5 shrink-0" />
							<span class="italic line-clamp-2">"{item.review?.comment}"</span>
						</div>
					</div>
				{:else}
					<button
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-text-inverse sm:w-auto"
						on:click={() =>
							openReviewModal({
								id: item.product_id,
								orderId: orderId,
								title: item.title,
								image: item.image
							})}
					>
						<StarIcon size={16} />
						Write a Review
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
