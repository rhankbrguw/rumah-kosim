<script lang="ts">
		import { StarIcon } from 'lucide-svelte';
	import { formatIDR } from '$lib/utils/currency';

	export let item: { product_id: number, title: string, image: string, price_at_time: number, quantity: number, reviewed?: boolean, review?: { comment: string } };
	export let orderStatus: string;
	export let orderId: number;
	export let openReviewModal: (item: { id: number, title: string, image: string, orderId: number }) => void;
</script>

<div class="flex items-center gap-4 rounded-lg border border-surface-alt bg-surface p-4">
	<img src={item.image} alt={item.title} class="h-16 w-16 rounded object-cover" />
	<div class="flex-1">
		<h5 class="text-sm font-medium text-text-main">{item.title}</h5>
		<p class="text-sm text-text-muted">
			{item.quantity} × {formatIDR(item.price_at_time)}
		</p>
		{#if orderStatus === 'Delivered'}
			{#if item.reviewed}
				<div class="mt-2 flex text-primary">
					<StarIcon size={14} />
					<span class="ml-1 text-xs text-text-muted">{item.review?.comment}</span>
				</div>
			{:else}
				<button
					class="mt-2 rounded bg-primary px-3 py-1 text-xs text-white"
					on:click={() =>
						openReviewModal({
							id: item.product_id,
							orderId: orderId,
							title: item.title,
							image: item.image
						})}
				>
					Review
				</button>
			{/if}
		{/if}
	</div>
	<p class="text-sm font-semibold text-text-main">
		{formatIDR(item.quantity * item.price_at_time)}
	</p>
</div>
