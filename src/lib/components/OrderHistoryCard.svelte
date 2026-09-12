<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Order } from '$lib/types';
	import { STRINGS } from '$lib/constants/strings.js';
	import OrderItem from './OrderItem.svelte';
	import { formatIDR } from '$lib/utils/currency.js';
	import { getStatusColor } from '$lib/utils/order.js';
	import ResumePaymentButton from './ResumePaymentButton.svelte';

	export let order: Order;
	export let isExpanded = false;
	export let openReviewModal: (productData: {
		id: number;
		title: string;
		image: string;
		orderId: number;
	}) => void;

	const dispatch = createEventDispatcher<{ toggle: void }>();
</script>

<div
	class="overflow-hidden rounded-2xl border border-surface-alt bg-surface shadow-sm transition-all hover:shadow-md"
>
	<div
		class="flex flex-col gap-3 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
	>
		<div class="flex-1 space-y-1">
			<p class="text-xs font-medium text-text-muted sm:text-sm">
				{new Date(order.date).toLocaleString([], {
					dateStyle: 'medium',
					timeStyle: 'short'
				})}
			</p>
			<p class="flex items-center gap-2 text-xs text-text-main sm:text-sm">
				<span class="text-text-muted">{STRINGS.ORDER_HISTORY.TRACKING}:</span>
				<span class="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
					{order.tracking_number}
				</span>
			</p>
			<div class="pt-0.5">
				<span
					class="text-micro inline-block rounded-full px-2.5 py-0.5 font-bold {getStatusColor(
						order.status
					)}"
				>
					{order.status}
				</span>
			</div>
		</div>

		<div class="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2">
			<p class="text-base font-bold text-primary sm:text-lg">{formatIDR(Number(order.total))}</p>
			{#if order.status === STRINGS.ORDER.STATUS_PENDING}
				<ResumePaymentButton orderId={order.id} />
			{/if}
			<button
				type="button"
				class="cursor-pointer text-xs font-bold text-primary transition-colors hover:text-primary-hover hover:underline sm:text-sm"
				on:click={() => dispatch('toggle')}
			>
				{isExpanded ? STRINGS.ORDER_HISTORY.HIDE_DETAILS : STRINGS.ORDER_HISTORY.VIEW_DETAILS}
			</button>
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t border-surface-alt bg-surface-alt/30 p-4 sm:p-6 lg:p-8">
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
				<div class="rounded-xl border border-surface-alt bg-surface p-4 shadow-sm lg:col-span-1">
					<h4 class="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
						{STRINGS.ORDER_HISTORY.SHIPPING_DETAILS}
					</h4>
					<div class="space-y-3 text-xs text-text-main sm:text-sm">
						<div>
							<span class="text-micro block font-semibold uppercase text-text-muted"
								>{STRINGS.ORDER_HISTORY.METHOD}</span
							>
							<span class="font-medium">{order.shipping_method}</span>
						</div>
						<div>
							<span class="text-micro block font-semibold uppercase text-text-muted"
								>{STRINGS.ORDER_HISTORY.ADDRESS}</span
							>
							<span class="block leading-relaxed">{order.shipping_address}</span>
						</div>
					</div>
				</div>

				<div class="lg:col-span-2">
					<h4 class="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
						{STRINGS.ORDER_HISTORY.ORDER_ITEMS}
					</h4>
					<div class="space-y-2.5">
						{#each order.items as item (item.product_id || item.title)}
							<OrderItem {item} orderStatus={order.status} orderId={order.id} {openReviewModal} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
