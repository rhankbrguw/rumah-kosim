<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Pencil, Plus } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { APP_CONFIG } from '$lib/constants/config.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { fade } from 'svelte/transition';
	import ProductTableDesktop from './ProductTableDesktop.svelte';
	import ProductDeleteButton from './ProductDeleteButton.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let products: {
		data: {
			id: number;
			title: string;
			price: number;
			quantity: number;
			image: string;
		}[];
		total: number;
	};
	export let searchTerm: string = '';
	export let currentPage: number = 1;
	export let itemsPerPage: number = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;

	let searchInput = searchTerm;

	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			const url = new URL($page.url);
			if (searchInput) {
				url.searchParams.set('search', searchInput);
			} else {
				url.searchParams.delete('search');
			}
			url.searchParams.set('productPage', '1');
			goto(url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
		}, 400);
	}

	function handlePageChange(e: CustomEvent<number>) {
		const url = new URL($page.url);
		url.searchParams.set('productPage', e.detail.toString());
		goto(url.toString(), { keepFocus: true });
	}

	const dispatch = createEventDispatcher();
</script>

<div
	class="rounded-2xl border border-surface-alt/50 bg-surface/80 p-4 shadow-sm backdrop-blur-md sm:p-6"
	transition:fade
>
	<div class="mb-5 flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
		<input
			type="text"
			class="w-full rounded-lg border border-secondary/30 bg-surface px-3.5 py-1.5 text-xs text-text-main shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-64 sm:text-sm"
			placeholder={STRINGS.ADMIN.PRODUCT_TABLE.SEARCH_PLACEHOLDER}
			bind:value={searchInput}
			on:input={handleInput}
		/>
		<button
			class="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
			on:click={() => dispatch('addProduct')}
		>
			<Plus size="16" />
			{STRINGS.ADMIN.PRODUCT_TABLE.ADD_BUTTON}
		</button>
	</div>

	<div class="grid gap-3 md:hidden">
		{#each products.data as product (product.id)}
			<div class="flex flex-col rounded-xl border border-surface-alt bg-surface p-3.5 shadow-sm">
				<div class="mb-2.5 flex items-start gap-3">
					<img
						src={product.image}
						alt={product.title}
						class="h-14 w-14 shrink-0 rounded-lg border border-surface-alt object-cover"
					/>
					<div class="min-w-0 flex-1">
						<h3 class="truncate text-xs font-semibold text-text-main sm:text-sm">
							{product.title}
						</h3>
						<p class="mt-0.5 text-xs font-bold text-primary sm:text-sm">
							{formatIDR(product.price)}
						</p>
						<p class="text-micro mt-0.5 text-text-muted">
							{STRINGS.ADMIN.PRODUCT_TABLE.STOCK_LABEL}:
							<span class="font-medium text-text-main">{product.quantity}</span>
						</p>
					</div>
				</div>
				<div class="flex items-center gap-2 border-t border-surface-alt pt-2.5">
					<label
						class="flex-1 cursor-pointer rounded-lg bg-surface-alt py-1.5 text-center text-xs font-medium text-text-main shadow-sm transition-colors hover:bg-secondary hover:text-text-inverse"
					>
						<input
							type="file"
							class="hidden"
							on:change={(e) => dispatch('uploadImage', { event: e, id: product.id })}
							accept="image/*"
						/>
						{STRINGS.ADMIN.PRODUCT_TABLE.UPLOAD}
					</label>
					<button
						class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-primary text-text-inverse transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
						title={STRINGS.ADMIN.PRODUCT_TABLE.EDIT_STOCK}
						on:click={() => dispatch('editStock', product)}
					>
						<Pencil size={15} />
					</button>
					<ProductDeleteButton {product} />
				</div>
			</div>
		{/each}
	</div>

	<ProductTableDesktop products={products.data} on:uploadImage on:editStock />
	<Pagination
		{currentPage}
		totalItems={products.total}
		{itemsPerPage}
		on:pageChange={handlePageChange}
	/>
</div>
