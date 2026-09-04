<script lang="ts">
	import { StarIcon, MessageCircle } from 'lucide-svelte';
	import { formatIDR } from '$lib/utils/currency.js';
	import { STRINGS } from '$lib/constants/strings.js';

	export let item: {
		product_id: number;
		title?: string;
		image?: string;
		price_at_time: number;
		quantity: number;
		reviewed?: boolean;
		review?: { comment?: string; rating?: number };
	};
	export let orderStatus: string;
	export let orderId: number;
	export let openReviewModal: (item: {
		id: number;
		title: string;
		image: string;
		orderId: number;
	}) => void;
</script>

<div
	class="flex flex-col gap-3 rounded-2xl border border-surface-alt bg-surface p-3.5 shadow-sm transition-all hover:border-primary/30 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
>
	<a href="/client/products/{item.product_id}" class="shrink-0">
		<img
			src={item.image || STRINGS.SHOP.FALLBACK_IMAGE}
			alt={item.title}
			class="w-15 sm:h-22 h-20 rounded-lg border border-surface-alt object-cover shadow-sm transition-transform hover:scale-105 sm:w-16"
		/>
	</a>

	<div class="flex flex-1 flex-col justify-between gap-2.5 py-0.5">
		<div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
			<div>
				<a
					href="/client/products/{item.product_id}"
					class="line-clamp-2 text-xs font-bold text-text-main transition-colors hover:text-primary sm:text-sm"
				>
					{item.title}
				</a>
				<p class="mt-0.5 text-xs text-text-muted">
					{formatIDR(Number(item.price_at_time))} × {item.quantity}
				</p>
			</div>
			<p class="shrink-0 text-xs font-bold text-primary sm:text-sm">
				{formatIDR(Number(item.price_at_time) * Number(item.quantity))}
			</p>
		</div>

		{#if orderStatus === STRINGS.ORDER.STATUS_DELIVERED}
			<div class="border-t border-surface-alt pt-2.5">
				{#if item.reviewed}
					<div class="flex flex-col gap-1 rounded-xl bg-surface-alt/60 p-2.5 text-xs">
						<div class="flex items-center gap-1 text-primary">
							{#each Array(5) as _, i (i)}
								<StarIcon
									size={13}
									fill={i < (item.review?.rating || 5) ? 'currentColor' : 'none'}
									class={i < (item.review?.rating || 5) ? 'text-primary' : 'text-secondary/30'}
								/>
							{/each}
							<span class="ml-1.5 font-bold text-text-main">{STRINGS.ORDER.REVIEWED}</span>
						</div>
						{#if item.review?.comment}
							<div class="mt-0.5 flex items-start gap-1.5 text-text-muted">
								<MessageCircle size={13} class="mt-0.5 shrink-0" />
								<span class="line-clamp-2 italic">"{item.review.comment}"</span>
							</div>
						{/if}
					</div>
				{:else}
					<button
						type="button"
						class="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-text-inverse sm:w-auto"
						on:click={() =>
							openReviewModal({
								id: item.product_id,
								orderId: orderId,
								title: item.title || '',
								image: item.image || ''
							})}
					>
						<StarIcon size={14} />
						<span>{STRINGS.PRODUCT.WRITE_REVIEW}</span>
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
