<script lang="ts">
	import { goto } from '$app/navigation';
	import { Star } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';

	export let book: {
		id: number;
		title: string;
		description: string;
		price: number;
		image: string;
		sold_count: number;
		average_rating: number;
	};

	let isImageLoaded = false;
	const goToProduct = () => goto(`/client/products/${book.id}`);
</script>

<div
	class="interactive-lift group flex h-full flex-col overflow-hidden rounded-xl border border-surface-alt/60 bg-surface/90 shadow-sm backdrop-blur-md sm:rounded-2xl"
>
	<button
		class="relative block aspect-[4/5] w-full cursor-pointer appearance-none overflow-hidden border-none bg-surface-alt/40 p-0 text-left"
		on:click={goToProduct}
	>
		{#if !isImageLoaded}
			<div class="absolute inset-0 animate-pulse bg-surface-alt/80"></div>
		{/if}
		<img
			src={book.image}
			alt={book.title}
			class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 {isImageLoaded
				? 'opacity-100'
				: 'opacity-0'}"
			width="400"
			height="500"
			on:load={() => (isImageLoaded = true)}
			on:error={(e) => {
				isImageLoaded = true;
				(e.target as HTMLImageElement).src = STRINGS.SHOP.FALLBACK_IMAGE;
			}}
			loading="lazy"
		/>
	</button>
	<div class="flex flex-1 flex-col p-3 sm:p-4">
		<div class="flex-1">
			<h3 class="line-clamp-2 text-xs font-bold leading-snug text-text-main sm:text-sm">
				{book.title}
			</h3>
			<p class="mt-1 text-xs font-bold text-primary sm:text-sm">
				{formatIDR(book.price)}
			</p>
			<div class="mt-1.5 flex items-center gap-1.5">
				<div class="flex items-center text-primary">
					<Star size={12} fill="currentColor" />
					<span class="text-micro ml-1 font-bold text-text-main"
						>{Number(book.average_rating || 0).toFixed(1)}</span
					>
				</div>
				<span class="text-micro text-text-muted">• {book.sold_count || 0} sold</span>
			</div>
		</div>

		<div class="mt-3 border-t border-surface-alt/50 pt-2.5 sm:mt-4 sm:pt-3">
			<button
				class="w-full cursor-pointer rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-text-inverse sm:py-2 sm:text-sm"
				on:click={goToProduct}
			>
				{STRINGS.SHOP.SHOW_MORE}
			</button>
		</div>
	</div>
</div>
