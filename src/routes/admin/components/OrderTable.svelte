<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { fade, scale } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { Eye } from 'lucide-svelte';
	import OrderDetailsModal from './OrderDetailsModal.svelte';

	export let orders: any[] = [];

	const dispatch = createEventDispatcher();
	let selectedOrder: any = null;

	function getStatusColor(status: string) {
		switch (status) {
			case 'Processing': return 'bg-primary text-text-inverse';
			case 'Shipped': return 'bg-primary-hover text-text-inverse';
			case 'Delivered': return 'bg-secondary text-text-inverse';
			case 'Cancelled': return 'bg-danger text-text-inverse';
			default: return 'bg-surface-alt text-text-main';
		}
	}
</script>

<div class="rounded-2xl border border-surface-alt/50 bg-surface/80 p-6 shadow-sm backdrop-blur-md" transition:fade>
	<div class="grid grid-cols-1 gap-4 md:hidden">
		{#each orders as order (order.id)}
			<div class="flex flex-col rounded-xl border border-surface-alt bg-surface-alt/20 p-4 shadow-sm">
				<div class="mb-3 flex flex-col gap-1 border-b border-surface-alt/50 pb-3">
					<div class="flex items-center justify-between">
						<span class="font-mono text-sm font-bold text-text-muted">#{order.id}</span>
						<span class="rounded-full px-2.5 py-0.5 text-xs font-semibold {getStatusColor(order.status)}">{order.status}</span>
					</div>
					<h3 class="font-bold text-text-main">{order.title || 'Multiple Items'}</h3>
					<p class="text-xs text-text-muted">User: <span class="font-medium text-text-main">{order.username}</span></p>
				</div>
				
				<div class="mb-3 flex justify-between text-sm">
					<div class="flex flex-col">
						<span class="text-xs text-text-muted">Price/Qty</span>
						<span class="font-semibold text-text-main">{order.title === 'Multiple Items' ? '-' : formatIDR(order.price_at_time || 0)} x {order.quantity || 1}</span>
					</div>
					<div class="flex flex-col items-end">
						<span class="text-xs text-text-muted">Total</span>
						<span class="font-bold text-primary">{formatIDR(order.total)}</span>
					</div>
				</div>

				<form method="POST" action="?/updateOrderStatus" use:enhance class="mt-2" on:change={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}>
					<input type="hidden" name="id" value={order.id} />
					<select name="status" class="w-full rounded-lg border border-secondary/50 bg-surface px-3 py-2 text-sm font-medium text-text-main focus:border-primary focus:ring-1 focus:ring-primary" bind:value={order.status}>
						<option value="Processing">Processing</option>
						<option value="Shipped">Shipped</option>
						<option value="Delivered">Delivered</option>
						<option value="Cancelled">Cancelled</option>
					</select>
				</form>

				<button class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-surface-alt py-2 text-sm font-medium text-text-main transition-colors hover:bg-secondary hover:text-text-inverse" on:click={() => selectedOrder = order}>
					<Eye size={16} /> View Details
				</button>
			</div>
		{/each}
	</div>

	<div class="hidden overflow-hidden rounded-xl border border-surface-alt bg-surface shadow-sm md:block">
		<table class="w-full whitespace-nowrap text-center">
			<thead>
				<tr class="border-b border-surface-alt text-secondary">
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.ID}</th>
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.TITLE}</th>
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.USER}</th>
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.QTY}</th>
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.PRICE}</th>
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.TOTAL}</th>
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.STATUS}</th>
					<th class="pb-4 font-medium">{STRINGS.ADMIN.ORDER_TABLE.COLS.ACTION}</th>
				</tr>
			</thead>
			<tbody>
				{#each orders as order (order.id)}
					<tr class="border-b border-surface-alt transition-colors hover:bg-surface-alt/50">
						<td class="py-4 font-mono text-sm text-text-muted">#{order.id}</td>
						<td class="py-4 font-medium text-text-main">{order.title || 'Multiple Items'}</td>
						<td class="py-4 text-text-main">{order.username}</td>
						<td class="py-4 text-text-main">{order.quantity || '-'}</td>
						<td class="py-4 text-text-main">{order.title === 'Multiple Items' ? '-' : formatIDR(order.price_at_time || 0)}</td>
						<td class="py-4 font-semibold text-primary">{formatIDR(order.total)}</td>
						<td class="py-4">
							<span class="rounded-full px-3 py-1 text-xs font-semibold {getStatusColor(order.status)}">{order.status}</span>
						</td>
						<td class="py-4">
							<div class="flex items-center justify-center gap-2">
								<form method="POST" action="?/updateOrderStatus" use:enhance on:change={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}>
									<input type="hidden" name="id" value={order.id} />
									<select name="status" class="rounded-lg border border-secondary/50 bg-surface px-2 py-1.5 text-xs font-medium text-text-main focus:border-primary focus:ring-1 focus:ring-primary" bind:value={order.status}>
										<option value="Processing">Processing</option>
										<option value="Shipped">Shipped</option>
										<option value="Delivered">Delivered</option>
										<option value="Cancelled">Cancelled</option>
									</select>
								</form>
								<button class="rounded-lg bg-surface-alt p-1.5 text-text-main transition-colors hover:bg-secondary hover:text-text-inverse" title="View Details" on:click={() => selectedOrder = order}>
									<Eye size={16} />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{#if selectedOrder}
	<OrderDetailsModal order={selectedOrder} on:close={() => selectedOrder = null} />
{/if}
