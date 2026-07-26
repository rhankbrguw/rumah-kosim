<script lang="ts">
	import { fade } from 'svelte/transition';
	import OrderDetailsModal from './OrderDetailsModal.svelte';
	import OrderTableDesktop from './OrderTableDesktop.svelte';
	import OrderTableMobile from './OrderTableMobile.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { APP_CONFIG } from '$lib/constants/config.js';

	import type { Order } from '$lib/types';
	export let orders: { data: Order[], total: number } = { data: [], total: 0 };
	export let currentPage: number = 1;
	export let itemsPerPage: number = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;

	let selectedOrder: Order | null = null;

	function getStatusColor(status: string) {
		switch (status) {
			case 'Processing':
				return 'bg-primary text-text-inverse';
			case 'Shipped':
				return 'bg-primary-hover text-text-inverse';
			case 'Delivered':
				return 'bg-secondary text-text-inverse';
			case 'Cancelled':
				return 'bg-danger text-text-inverse';
			default:
				return 'bg-surface-alt text-text-main';
		}
	}

	function handlePageChange(e: CustomEvent<number>) {
		const url = new URL($page.url);
		url.searchParams.set('orderPage', e.detail.toString());
		goto(url.toString(), { keepFocus: true });
	}
</script>

<div
	class="rounded-2xl border border-surface-alt/50 bg-surface/80 p-6 shadow-sm backdrop-blur-md"
	transition:fade={{ duration: 200 }}
>
	<OrderTableMobile orders={orders.data} on:selectOrder={(e) => (selectedOrder = e.detail)} {getStatusColor} />
	<OrderTableDesktop orders={orders.data} on:selectOrder={(e) => (selectedOrder = e.detail)} {getStatusColor} />
	<Pagination {currentPage} totalItems={orders.total} {itemsPerPage} on:pageChange={handlePageChange} />
</div>

{#if selectedOrder}
	<OrderDetailsModal order={selectedOrder} on:close={() => (selectedOrder = null)} />
{/if}
