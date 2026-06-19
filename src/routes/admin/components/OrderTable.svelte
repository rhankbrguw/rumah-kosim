<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { fade, scale } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { X, Eye } from 'lucide-svelte';

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
	<!-- Mobile Card View -->
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

	<!-- Desktop Table View -->
	<div class="hidden overflow-x-auto md:block">
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

<!-- Order Details Modal -->
{#if selectedOrder}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 pb-6 pt-24 backdrop-blur-sm" transition:fade={{ duration: 200 }}>
	<div class="w-full max-w-2xl overflow-hidden rounded-2xl bg-surface/95 shadow-2xl backdrop-blur-md" transition:scale={{ duration: 200, start: 0.95 }}>
		<div class="flex items-center justify-between border-b border-secondary/30 px-6 py-4">
			<h2 class="text-xl font-bold text-text-main">Order #{selectedOrder.id} Details</h2>
			<button class="rounded-full p-2 text-secondary transition-colors hover:bg-secondary/20 hover:text-text-main" on:click={() => selectedOrder = null}>
				<X size={20} />
			</button>
		</div>
		
		<div class="max-h-[60vh] overflow-y-auto p-6">
			<h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">Purchased Items</h3>
			<div class="space-y-4">
				{#each selectedOrder.items || [] as item}
					<div class="flex items-center gap-4 rounded-xl border border-secondary/20 bg-surface-alt/30 p-4">
						<img src={item.image} alt={item.title} class="h-16 w-16 rounded-lg object-cover shadow-sm" />
						<div class="flex-1">
							<h4 class="font-bold text-text-main">{item.title}</h4>
							<p class="text-sm text-text-muted">{formatIDR(item.price_at_time)} x {item.quantity}</p>
						</div>
						<div class="text-right">
							<p class="font-bold text-primary">{formatIDR(item.price_at_time * item.quantity)}</p>
						</div>
					</div>
				{/each}
			</div>
			
			<h3 class="mb-3 mt-8 text-sm font-bold uppercase tracking-wide text-text-muted">Shipping Information</h3>
			<div class="rounded-xl border border-secondary/20 bg-surface-alt/30 p-4 text-sm text-text-main">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<p class="mb-1 text-xs text-text-muted">Customer Name</p>
						<p class="font-medium">{selectedOrder.username || 'Unknown'}</p>
					</div>
					<div>
						<p class="mb-1 text-xs text-text-muted">Tracking Number</p>
						<p class="font-mono font-medium text-primary">{selectedOrder.tracking_number || 'Not updated'}</p>
					</div>
					<div class="sm:col-span-2">
						<p class="mb-1 text-xs text-text-muted">Shipping Address</p>
						<p class="font-medium">{selectedOrder.shipping_address || 'No address provided'}</p>
					</div>
					<div class="sm:col-span-2 flex justify-between border-t border-secondary/20 pt-3">
						<p class="text-text-muted">Shipping Method ({selectedOrder.shipping_method})</p>
						<p class="font-bold">{formatIDR(selectedOrder.shipping_price || 0)}</p>
					</div>
				</div>
			</div>
			
			<div class="mt-6 flex items-center justify-between rounded-xl bg-primary/10 p-4">
				<span class="font-bold text-text-main">Grand Total</span>
				<span class="text-xl font-bold text-primary">{formatIDR(selectedOrder.total)}</span>
			</div>
		</div>
	</div>
</div>
{/if}
