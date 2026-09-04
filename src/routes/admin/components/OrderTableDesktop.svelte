<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { enhance } from '$app/forms';
	import { Eye, ChevronDown } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	import type { Order } from '$lib/types';
	export let orders: Order[];
	export let totalItems: number = 0;
	export let currentPage: number = 1;
	export let itemsPerPage: number = 20;
	export let getStatusColor: (status: string) => string;

	const dispatch = createEventDispatcher();
</script>

<div
	class="hidden overflow-x-auto rounded-xl border border-surface-alt bg-surface shadow-sm md:block"
>
	<table class="w-full whitespace-nowrap text-center text-xs lg:text-sm">
		<thead>
			<tr class="border-b border-surface-alt text-secondary">
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.ID}</th>
				<th class="px-3 py-3.5 text-left font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.TITLE}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.USER}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.QTY}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.PRICE}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.TOTAL}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.STATUS}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.ORDER_TABLE.COLS.ACTION}</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-surface-alt/60">
			{#each orders as order, index (order.id)}
				<tr class="transition-colors hover:bg-surface-alt/40">
					<td class="px-3 py-3 font-mono text-xs font-medium text-text-muted">
						<span class="block"
							>#{totalItems
								? totalItems - ((currentPage - 1) * itemsPerPage + index)
								: index + 1}</span
						>
						<span class="text-micro block font-mono text-primary">{order.tracking_number}</span>
					</td>

					<td class="max-w-[200px] px-3 py-3 text-left font-medium text-text-main">
						<span class="block truncate" title={order.title}>{order.title || '-'}</span>
					</td>
					<td class="px-3 py-3 text-text-main">{order.username}</td>
					<td class="px-3 py-3 font-medium text-text-main">{order.quantity || 1}</td>

					<td class="px-3 py-3">
						{#if order.items && order.items.length > 1}
							<span
								class="text-micro rounded bg-surface-alt px-2 py-0.5 font-medium text-text-muted"
							>
								{STRINGS.ORDER.PRICE_VARIES}
							</span>
						{:else}
							<span class="text-text-main">{formatIDR(Number(order.price_at_time) || 0)}</span>
						{/if}
					</td>
					<td class="px-3 py-3 font-semibold text-primary">{formatIDR(Number(order.total))}</td>
					<td class="px-3 py-3">
						<span
							class="text-micro inline-block rounded-full px-2.5 py-0.5 font-semibold {getStatusColor(order.status as string)}"
						>
							{order.status}
						</span>
					</td>
					<td class="px-3 py-3">
						<div class="flex items-center justify-center gap-1.5">
							<form
								method="POST"
								action="?/updateOrderStatus"
								use:enhance
								on:change={(e) => e.currentTarget.requestSubmit()}
								class="inline-block"
							>
								<input type="hidden" name="id" value={order.id} />
								<div class="relative inline-flex items-center">
									<select
										name="status"
										class="select-clean cursor-pointer appearance-none rounded-lg border border-secondary/30 bg-surface py-1 pl-2.5 pr-7 text-xs font-medium text-text-main shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
										bind:value={order.status}
										disabled={order.status === STRINGS.ORDER.STATUS_PENDING}
									>
										<option value={STRINGS.ORDER.STATUS_PENDING}
											>{STRINGS.ORDER.STATUS_PENDING}</option
										>
										<option value={STRINGS.ORDER.STATUS_PROCESSING}
											>{STRINGS.ORDER.STATUS_PROCESSING}</option
										>
										<option value={STRINGS.ORDER.STATUS_SHIPPED}
											>{STRINGS.ORDER.STATUS_SHIPPED}</option
										>
										<option value={STRINGS.ORDER.STATUS_DELIVERED}
											>{STRINGS.ORDER.STATUS_DELIVERED}</option
										>
										<option value={STRINGS.ORDER.STATUS_CANCELLED}
											>{STRINGS.ORDER.STATUS_CANCELLED}</option
										>
									</select>
									<div class="pointer-events-none absolute right-2 text-text-muted">
										<ChevronDown size={12} />
									</div>
								</div>
							</form>
							<button
								class="cursor-pointer rounded-lg bg-surface-alt p-1.5 text-text-main shadow-sm transition-colors hover:bg-secondary hover:text-text-inverse"
								title={STRINGS.ORDER.VIEW_DETAILS}
								on:click={() => dispatch('selectOrder', order)}
							>
								<Eye size={15} />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
