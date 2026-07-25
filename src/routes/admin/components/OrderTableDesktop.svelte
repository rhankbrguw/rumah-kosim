<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { enhance } from '$app/forms';
	import { Eye } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	import type { Order } from '$lib/types';
	export let orders: Order[];
	export let getStatusColor: (status: string) => string;

	const dispatch = createEventDispatcher();
</script>

<div
	class="hidden overflow-hidden rounded-xl border border-surface-alt bg-surface shadow-sm md:block"
>
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
					<td class="py-4 text-text-main"
						>{order.title === 'Multiple Items'
							? '-'
							: formatIDR(Number(order.price_at_time) || 0)}</td
					>
					<td class="py-4 font-semibold text-primary">{formatIDR(Number(order.total))}</td>
					<td class="py-4">
						<span
							class="rounded-full px-3 py-1 text-xs font-semibold {getStatusColor(order.status as string)}"
							>{order.status}</span
						>
					</td>
					<td class="py-4">
						<div class="flex items-center justify-center gap-2">
							<form
								method="POST"
								action="?/updateOrderStatus"
								use:enhance
								on:change={(e) => e.currentTarget.requestSubmit()}
							>
								<input type="hidden" name="id" value={order.id} />
								<select
									name="status"
									class="rounded-lg border border-secondary/50 bg-surface px-2 py-1.5 text-xs font-medium text-text-main focus:border-primary focus:ring-1 focus:ring-primary"
									bind:value={order.status}
								>
									<option value="Processing">Processing</option>
									<option value="Shipped">Shipped</option>
									<option value="Delivered">Delivered</option>
									<option value="Cancelled">Cancelled</option>
								</select>
							</form>
							<button
								class="rounded-lg bg-surface-alt p-1.5 text-text-main transition-colors hover:bg-secondary hover:text-text-inverse"
								title="View Details"
								on:click={() => dispatch('selectOrder', order)}
							>
								<Eye size={16} />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
