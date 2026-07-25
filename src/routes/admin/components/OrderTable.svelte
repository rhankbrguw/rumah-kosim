<script lang="ts">
	import { fade } from 'svelte/transition';
	import OrderDetailsModal from './OrderDetailsModal.svelte';
	import OrderTableDesktop from './OrderTableDesktop.svelte';
	import OrderTableMobile from './OrderTableMobile.svelte';

	import type { Order } from '$lib/types';
	export let orders: Order[] = [];

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
</script>

<div
	class="rounded-2xl border border-surface-alt/50 bg-surface/80 p-6 shadow-sm backdrop-blur-md"
	transition:fade={{ duration: 200 }}
>
	<OrderTableMobile {orders} on:selectOrder={(e) => (selectedOrder = e.detail)} {getStatusColor} />
	<OrderTableDesktop {orders} on:selectOrder={(e) => (selectedOrder = e.detail)} {getStatusColor} />
</div>

{#if selectedOrder}
	<OrderDetailsModal order={selectedOrder} on:close={() => (selectedOrder = null)} />
{/if}
