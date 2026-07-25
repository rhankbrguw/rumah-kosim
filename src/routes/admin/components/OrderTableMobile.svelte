<script lang="ts">
	import { formatIDR } from '$lib/utils/currency.js';
	import { enhance } from '$app/forms';
	import { Eye } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	import type { Order } from '$lib/types';
	export let orders: Order[];
	export let getStatusColor: (status: string) => string;

	const dispatch = createEventDispatcher();
</script>

<div class="grid grid-cols-1 gap-4 md:hidden">
	{#each orders as order (order.id)}
		<div class="flex flex-col rounded-xl border border-surface-alt bg-surface-alt/20 p-4 shadow-sm">
			<div class="mb-3 flex flex-col gap-1 border-b border-surface-alt/50 pb-3">
				<div class="flex items-center justify-between">
					<span class="font-mono text-sm font-bold text-text-muted">#{order.id}</span>
					<span
						class="rounded-full px-2.5 py-0.5 text-xs font-semibold {getStatusColor(order.status as string)}"
						>{order.status}</span
					>
				</div>
				<h3 class="font-bold text-text-main">{order.title || 'Multiple Items'}</h3>
				<p class="text-xs text-text-muted">
					User: <span class="font-medium text-text-main">{order.username}</span>
				</p>
			</div>

			<div class="mb-3 flex justify-between text-sm">
				<div class="flex flex-col">
					<span class="text-xs text-text-muted">Price/Qty</span>
					<span class="font-semibold text-text-main"
						>{order.title === 'Multiple Items' ? '-' : formatIDR(Number(order.price_at_time) || 0)} x
						{order.quantity || 1}</span
					>
				</div>
				<div class="flex flex-col items-end">
					<span class="text-xs text-text-muted">Total</span>
					<span class="font-bold text-primary">{formatIDR(Number(order.total))}</span>
				</div>
			</div>

			<form
				method="POST"
				action="?/updateOrderStatus"
				use:enhance
				class="mt-2"
				on:change={(e) => e.currentTarget.requestSubmit()}
			>
				<input type="hidden" name="id" value={order.id} />
				<select
					name="status"
					class="w-full rounded-lg border border-secondary/50 bg-surface px-3 py-2 text-sm font-medium text-text-main focus:border-primary focus:ring-1 focus:ring-primary"
					bind:value={order.status}
				>
					<option value="Processing">Processing</option>
					<option value="Shipped">Shipped</option>
					<option value="Delivered">Delivered</option>
					<option value="Cancelled">Cancelled</option>
				</select>
			</form>

			<button
				class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-surface-alt py-2 text-sm font-medium text-text-main transition-colors hover:bg-secondary hover:text-text-inverse"
				on:click={() => dispatch('selectOrder', order)}
			>
				<Eye size={16} /> View Details
			</button>
		</div>
	{/each}
</div>
