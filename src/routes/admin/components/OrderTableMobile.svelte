<script lang="ts">
	import { formatIDR } from '$lib/utils/currency.js';
	import { STRINGS } from '$lib/constants/strings.js';
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

<div class="grid grid-cols-1 gap-3 md:hidden">
	{#each orders as order, index (order.id)}
		<div class="flex flex-col rounded-xl border border-surface-alt bg-surface p-3.5 shadow-sm">
			<div
				class="mb-2.5 flex items-start justify-between gap-2 border-b border-surface-alt/60 pb-2.5"
			>
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<span class="font-mono text-xs font-bold text-text-muted">
							#{totalItems ? totalItems - ((currentPage - 1) * itemsPerPage + index) : index + 1}
						</span>
						<span
							class="text-micro rounded bg-primary/10 px-1.5 py-0.5 font-mono font-bold text-primary"
						>
							{order.tracking_number}
						</span>
					</div>
					<h3 class="line-clamp-1 text-sm font-semibold text-text-main">
						{order.title || '-'}
					</h3>

					<p class="mt-0.5 text-xs text-text-muted">
						{STRINGS.ADMIN.ORDER_TABLE.COLS.USER}:
						<span class="font-medium text-text-main">{order.username}</span>
					</p>
				</div>
				<span
					class="text-micro shrink-0 rounded-full px-2.5 py-0.5 font-semibold {getStatusColor(order.status as string)}"
				>
					{order.status}
				</span>
			</div>

			<div class="mb-3 flex items-center justify-between text-xs">
				<div class="flex flex-col">
					<span class="text-micro text-text-muted"
						>{STRINGS.ADMIN.ORDER_TABLE.COLS.PRICE}/{STRINGS.ADMIN.ORDER_TABLE.COLS.QTY}</span
					>
					<span class="mt-0.5 font-medium text-text-main">
						{#if order.items && order.items.length > 1}
							{STRINGS.ORDER.PRICE_VARIES} ({order.quantity || 1} pcs)
						{:else}
							{formatIDR(Number(order.price_at_time) || 0)} × {order.quantity || 1}
						{/if}
					</span>
				</div>
				<div class="flex flex-col items-end">
					<span class="text-micro text-text-muted">{STRINGS.ADMIN.ORDER_TABLE.COLS.TOTAL}</span>
					<span class="mt-0.5 text-sm font-bold text-primary">{formatIDR(Number(order.total))}</span
					>
				</div>
			</div>

			<div class="flex items-center gap-2 pt-1">
				<form
					method="POST"
					action="?/updateOrderStatus"
					use:enhance
					class="flex-1"
					on:change={(e) => e.currentTarget.requestSubmit()}
				>
					<input type="hidden" name="id" value={order.id} />
					<div class="relative w-full">
						<select
							name="status"
							class="select-clean w-full cursor-pointer appearance-none rounded-lg border border-secondary/30 bg-surface py-1.5 pl-2.5 pr-7 text-xs font-medium text-text-main shadow-sm transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							bind:value={order.status}
							disabled={order.status === STRINGS.ORDER.STATUS_PENDING}
						>
							<option value={STRINGS.ORDER.STATUS_PENDING}>{STRINGS.ORDER.STATUS_PENDING}</option>
							<option value={STRINGS.ORDER.STATUS_PROCESSING}
								>{STRINGS.ORDER.STATUS_PROCESSING}</option
							>
							<option value={STRINGS.ORDER.STATUS_SHIPPED}>{STRINGS.ORDER.STATUS_SHIPPED}</option>
							<option value={STRINGS.ORDER.STATUS_DELIVERED}
								>{STRINGS.ORDER.STATUS_DELIVERED}</option
							>
							<option value={STRINGS.ORDER.STATUS_CANCELLED}
								>{STRINGS.ORDER.STATUS_CANCELLED}</option
							>
						</select>
						<div
							class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
						>
							<ChevronDown size={13} />
						</div>
					</div>
				</form>

				<button
					class="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-surface-alt px-3 py-1.5 text-xs font-medium text-text-main shadow-sm transition-colors hover:bg-secondary hover:text-text-inverse"
					on:click={() => dispatch('selectOrder', order)}
				>
					<Eye size={14} />
					{STRINGS.ORDER.VIEW_DETAILS}
				</button>
			</div>
		</div>
	{/each}
</div>
