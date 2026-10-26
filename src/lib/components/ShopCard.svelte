<script lang="ts">
	import { goto } from '$app/navigation';
	import { Star } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { CLIENT_ROUTES } from '$lib/constants/routes.js';
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
	const goToProduct = () => goto(CLIENT_ROUTES.PRODUCT_DETAIL(book.id));
</script>

<div
	class="interactive-lift group flex h-full flex-col overflow-hidden rounded-xl border border-surface-alt/70 bg-surface/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:rounded-2xl"
>
	<button
		class="relative block aspect-[4/5] w-full cursor-pointer appearance-none overflow-hidden border-none bg-surface-alt/40 p-0 text-left"
		on:click={goToProduct}
	>
		{#if !isImageLoaded}
			<div class="absolute inset-0 animate-pulse bg-surface-alt/80"></div>
		{/if}
		<div
			class="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-surface-alt/40 bg-surface/85 px-2 py-0.5 shadow-sm backdrop-blur-md"
		>
			<Star size={11} class="text-primary" fill="currentColor" />
			<span class="text-micro font-bold text-text-main"
				>{Number(book.average_rating || 0).toFixed(1)}</span
			>
		</div>
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
			<div class="text-micro mt-1.5 flex items-center gap-1.5 text-text-muted">
				<span>{book.sold_count || 0} {STRINGS.SHOP.SOLD}</span>
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
