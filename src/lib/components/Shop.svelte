<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Pagination from './Pagination.svelte';
	import ShopSkeleton from './ShopSkeleton.svelte';
	import ShopCard from './ShopCard.svelte';
	import ShippingPromoModal from './ShippingPromoModal.svelte';
	import { auth } from '$lib/stores/auth';
	import { STRINGS } from '$lib/constants/strings.js';
	import { APP_CONFIG } from '$lib/constants/config.js';
	import { shippingModalStore } from '$lib/stores/uiStore';

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
	$: searchInput = searchTerm;

	onMount(() => {
		if ($auth.isAuthenticated && !$auth.isAdmin && $auth.user?.id) {
			isModalVisible = shippingModalStore.checkAndShow($auth.user.id);
		}
	});

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

	function handleClearSearch() {
		searchInput = '';
		const url = new URL(window.location.href);
		url.searchParams.delete('search');
		url.searchParams.set('page', '1');
		goto(url.toString(), { keepFocus: true, noScroll: true });
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

<section class="page-enter sm:mt-18 mt-14 p-3.5 sm:p-6 lg:p-8">
	<div class="relative mb-3.5 sm:mb-5">
		<div class="relative">
			<input
				type="text"
				class="w-full rounded-xl border border-surface-alt/60 bg-surface/90 px-3.5 py-2 pl-9 text-xs text-text-main shadow-sm backdrop-blur-md transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary sm:text-sm md:w-80"
				placeholder={STRINGS.SHOP.SEARCH_PLACEHOLDER}
				bind:value={searchInput}
				on:input={handleInput}
			/>
			<div class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
				<Search size={16} />
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="mb-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
			<ShopSkeleton />
		</div>
	{:else if books.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-xl border border-surface-alt/50 bg-surface/80 py-12 text-center sm:rounded-2xl sm:py-16"
		>
			<Search size={36} class="text-text-muted/60" />
			<p class="mt-3 text-xs font-semibold text-text-main sm:text-sm">
				{searchTerm ? STRINGS.SHOP.NO_RESULTS : STRINGS.SHOP.NO_BOOKS_AVAILABLE}
			</p>
			{#if searchTerm}
				<button
					class="mt-3.5 cursor-pointer rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
					on:click={handleClearSearch}
				>
					{STRINGS.SHOP.CLEAR_SEARCH}
				</button>
			{/if}
		</div>
	{:else}
		<div class="mb-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each books as book (book.id)}
				<ShopCard {book} />
			{/each}
		</div>
		<Pagination {currentPage} totalItems={total} {itemsPerPage} on:pageChange={handlePageChange} />
	{/if}
</section>
