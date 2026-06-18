<script lang="ts">
		import { createEventDispatcher } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';

	export let orders: { id: number, title?: string, username?: string, quantity?: number, price_at_time?: number, date: string, total: number, status: string }[] = [];

	const dispatch = createEventDispatcher();

	function getStatusColor(status: string) {
		switch (status) {
			case 'Processing':
				return 'bg-primary';
			case 'Shipped':
				return 'bg-primary-hover';
			case 'Delivered':
				return 'bg-secondary';
			default:
				return 'bg-surface-alt text-text-main';
		}
	}
</script>

<div class="rounded-lg bg-surface p-4 shadow-sm" transition:fade>
	<div class="overflow-x-auto">
		<table class="w-full text-left">
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
					<tr class="border-b border-surface-alt transition-colors hover:bg-surface-alt">
						<td class="py-4 text-text-main">#{order.id}</td>
						<td class="py-4 text-text-main">{order.title}</td>
						<td class="py-4 text-text-main">{order.username}</td>
						<td class="py-4 text-text-main">{order.quantity}</td>
						<td class="py-4 text-text-main">{formatIDR(order.price_at_time || 0)}</td>
						<td class="py-4 font-medium text-text-main">{formatIDR(order.total)}</td>
						<td class="py-4">
							<span
								class="rounded-full px-3 py-1 text-sm text-text-inverse {getStatusColor(
									order.status
								)}"
							>
								{order.status}
							</span>
						</td>
						<td class="py-4">
							<form method="POST" action="?/updateOrderStatus" use:enhance on:change={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}>
								<input type="hidden" name="id" value={order.id} />
								<select
									name="status"
									class="rounded-md border border-secondary px-3 py-1.5 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary"
									bind:value={order.status}
								>
									<option value="Processing">Processing</option>
									<option value="Shipped">Shipped</option>
									<option value="Delivered">Delivered</option>
									<option value="Cancelled">Cancelled</option>
								</select>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
