<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, Star } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Pagination from './Pagination.svelte';
	import ShopSkeleton from './ShopSkeleton.svelte';
	import ShippingPromoModal from './ShippingPromoModal.svelte';
	import { auth } from '$lib/stores/auth';
	import { STRINGS } from '$lib/constants/strings.js';
	import { APP_CONFIG } from '$lib/constants/config.js';
	import { formatIDR } from '$lib/utils/currency.js';

	export let books: {
		id: number;
		title: string;
		description: string;
		price: number;
		image: string;
		sold_count: number;
		average_rating: number;
	}[] = [];
	export let total: number = 0;
	export let currentPage: number = 1;
	export let itemsPerPage: number = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
	export let searchTerm: string = '';
	export let isLoading: boolean = true;

	let searchInput = searchTerm;
	let isModalVisible = false;

	import { shippingModalStore } from '$lib/stores/uiStore';

	onMount(() => {
		if ($auth.isAuthenticated && !$auth.isAdmin && $auth.user?.id) {
			isModalVisible = shippingModalStore.checkAndShow($auth.user.id);
		}
	});

	const goToProduct = (id: number) => goto(`/client/products/${id}`);

	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			const url = new URL(window.location.href);
			if (searchInput) {
				url.searchParams.set('search', searchInput);
			} else {
				url.searchParams.delete('search');
			}
			url.searchParams.set('page', '1');
			goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
		}, 400);
	}

	function handlePageChange(e: CustomEvent<number>) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', e.detail.toString());
		goto(url.toString(), { keepFocus: true });
	}
</script>

{#if isModalVisible}
	<ShippingPromoModal bind:isModalVisible />
{/if}

<section class="mt-16 p-4 sm:mt-20 sm:p-24 sm:px-4 sm:py-4">
	<div class="relative mb-4 sm:mb-6">
		<div class="relative">
			<input
				type="text"
				class="w-full rounded-xl border border-surface-alt/50 bg-surface/80 px-4 py-3 pl-11 text-text-main shadow-sm backdrop-blur-md transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary md:w-80"
				placeholder={STRINGS.SHOP.SEARCH_PLACEHOLDER}
				bind:value={searchInput}
				on:input={handleInput}
			/>
			<div class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
				<Search size={20} />
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
			<ShopSkeleton />
		</div>
	{:else}
		<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
			{#each books as book (book.id)}
				<div
					class="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-alt/50 bg-surface/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-surface/95 hover:shadow-xl"
				>
					<button
						class="relative block aspect-[4/5] w-full cursor-pointer appearance-none overflow-hidden border-none bg-surface-alt/50 p-0 text-left"
						on:click={() => goToProduct(book.id)}
					>
						<img
							src={book.image}
							alt={book.title}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							on:error={(e) => ((e.target as HTMLImageElement).src = STRINGS.SHOP.FALLBACK_IMAGE)}
							loading="lazy"
						/>
					</button>
					<div class="flex flex-1 flex-col p-4 sm:p-5">
						<div class="flex-1">
							<h3 class="line-clamp-2 text-base font-bold text-text-main sm:text-lg">
								{book.title}
							</h3>
							<p class="mt-1 text-sm font-semibold text-danger sm:text-base">
								{formatIDR(book.price)}
							</p>
							<div class="mt-2 flex items-center gap-1.5">
								<div class="flex items-center text-primary">
									<Star size={14} fill="currentColor" />
									<span class="ml-1 text-xs font-bold text-text-main"
										>{Number(book.average_rating || 0).toFixed(1)}</span
									>
								</div>
								<span class="text-xs text-text-muted">• {book.sold_count || 0} sold</span>
							</div>
						</div>

						<div class="mt-4 border-t border-surface-alt/50 pt-4">
							<button
								class="w-full rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-colors duration-300 hover:bg-primary hover:text-text-inverse"
								on:click={() => goToProduct(book.id)}
							>
								{STRINGS.SHOP.SHOW_MORE}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<Pagination {currentPage} totalItems={total} {itemsPerPage} on:pageChange={handlePageChange} />
	{/if}
</section>
