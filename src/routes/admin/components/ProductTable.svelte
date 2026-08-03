<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Pencil, Trash2, Plus } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { APP_CONFIG } from '$lib/constants/config.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import ProductTableDesktop from './ProductTableDesktop.svelte';
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
	class="rounded-2xl border border-surface-alt/50 bg-surface/80 p-6 shadow-sm backdrop-blur-md"
	transition:fade
>
	<div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
		<input
			type="text"
			class="w-full rounded-lg border border-secondary px-4 py-2 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:w-64"
			placeholder={STRINGS.ADMIN.PRODUCT_TABLE.SEARCH_PLACEHOLDER}
			bind:value={searchInput}
			on:input={handleInput}
		/>
		<button
			class="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-text-inverse transition-colors hover:bg-primary-hover"
			on:click={() => dispatch('addProduct')}
		>
			<Plus size="18" />
			{STRINGS.ADMIN.PRODUCT_TABLE.ADD_BUTTON}
		</button>
	</div>

	<div class="grid gap-4 md:hidden">
		{#each products.data as product (product.id)}
			<div
				class="flex flex-col rounded-xl border border-surface-alt bg-surface-alt/20 p-4 shadow-sm"
			>
				<div class="mb-3 flex items-start gap-4">
					<img
						src={product.image}
						alt={product.title}
						class="h-16 w-16 rounded-lg border border-secondary/20 object-cover"
					/>
					<div class="flex-1">
						<h3 class="line-clamp-1 font-bold text-text-main">{product.title}</h3>
						<p class="text-sm font-semibold text-primary">{formatIDR(product.price)}</p>
						<p class="text-xs text-text-muted">
							Stock: <span class="font-medium text-text-main">{product.quantity}</span>
						</p>
					</div>
				</div>
				<div class="flex items-center gap-2 border-t border-surface-alt/50 pt-3">
					<label
						class="flex-1 cursor-pointer rounded-lg bg-surface-alt py-2 text-center text-xs font-medium text-text-main transition-colors hover:bg-secondary hover:text-text-inverse"
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
						class="rounded-lg bg-primary p-2 text-text-inverse transition-colors hover:bg-primary-hover"
						on:click={() => dispatch('editStock', product)}
					>
						<Pencil size="16" />
					</button>
					<form
						method="POST"
						action="?/deleteProduct"
						use:enhance
						on:submit={(e) => {
							if (!confirm('Are you sure you want to delete this product?')) e.preventDefault();
						}}
					>
						<input type="hidden" name="id" value={product.id} />
						<button
							type="submit"
							class="rounded-lg bg-danger p-2 text-text-inverse transition-colors hover:bg-danger-hover"
						>
							<Trash2 size="16" />
						</button>
					</form>
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
