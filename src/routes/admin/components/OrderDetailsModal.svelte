<script lang="ts">
	import { formatIDR } from '$lib/utils/currency.js';
	import { STRINGS } from '$lib/constants/strings.js';
	import { getStatusColor } from '$lib/utils/order.js';
	import { createEventDispatcher } from 'svelte';
	import ModalShell from '$lib/components/ModalShell.svelte';
	import { Package, User, MapPin, Truck, Hash } from 'lucide-svelte';
	import type { Order } from '$lib/types';

	export let order: Order;
	const dispatch = createEventDispatcher<{ close: void }>();

	$: itemsSubtotal = (order.items || []).reduce(
		(sum, item) => sum + Number(item.price_at_time || 0) * Number(item.quantity || 1),
		0
	);
</script>

<ModalShell
	title={`${STRINGS.ORDER.ORDER_DETAILS}`}
	maxWidthClass="max-w-2xl"
	panelClass="flex max-h-[76dvh] flex-col overflow-hidden rounded-2xl sm:max-h-[85vh] sm:rounded-3xl"
	contentClass="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5"
	on:close={() => dispatch('close')}
>
	<div class="space-y-3 sm:space-y-5">
		<div
			class="flex flex-col gap-2.5 rounded-2xl border border-surface-alt bg-surface-alt/40 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
		>
			<div class="flex items-center gap-2.5">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
				>
					<Hash size={18} />
				</div>
				<div>
					<p class="text-micro font-bold uppercase tracking-wider text-text-muted">
						{STRINGS.ORDER.TRACKING_NUMBER}
					</p>
					<p class="font-mono text-xs font-bold text-text-main sm:text-sm">
						{order.tracking_number || '-'}
					</p>
				</div>
			</div>
			<span
				class="w-fit rounded-full px-3 py-1 text-xs font-bold shadow-sm {getStatusColor(
					order.status
				)}"
			>
				{order.status}
			</span>
		</div>

		<div>
			<div class="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase text-text-muted">
				<Package size={14} class="text-primary" />
				<span>{STRINGS.ORDER.PURCHASED_ITEMS} ({order.items?.length || 0})</span>
			</div>
			<div class="space-y-2">
				{#each order.items || [] as item, idx (idx)}
					<div
						class="flex items-center gap-2.5 rounded-xl border border-surface-alt bg-surface p-2.5 shadow-sm sm:gap-4 sm:p-3"
					>
						<img
							src={item.image || STRINGS.SHOP.FALLBACK_IMAGE}
							alt={item.title}
							class="h-14 w-11 shrink-0 rounded-md border border-surface-alt object-cover shadow-sm sm:h-16 sm:w-14"
						/>
						<div class="min-w-0 flex-1">
							<h4 class="line-clamp-1 text-xs font-bold text-text-main sm:text-sm">
								{item.title}
							</h4>
							<p class="mt-0.5 text-xs text-text-muted">
								{formatIDR(Number(item.price_at_time))} × {item.quantity}
							</p>
						</div>
						<p class="shrink-0 text-xs font-bold text-primary sm:text-sm">
							{formatIDR(Number(item.price_at_time) * Number(item.quantity))}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="rounded-2xl border border-surface-alt bg-surface p-3 shadow-sm sm:p-5">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="flex items-start gap-2.5">
					<User size={16} class="mt-0.5 shrink-0 text-primary" />
					<div>
						<p class="text-micro font-semibold uppercase text-text-muted">
							{STRINGS.ORDER.CUSTOMER_NAME}
						</p>
						<p class="text-xs font-bold text-text-main sm:text-sm">
							{order.username || STRINGS.ORDER.UNKNOWN_USER}
						</p>
					</div>
				</div>

				<div class="flex items-start gap-2.5">
					<Truck size={16} class="mt-0.5 shrink-0 text-primary" />
					<div>
						<p class="text-micro font-semibold uppercase text-text-muted">
							{STRINGS.ORDER.SHIPPING_METHOD}
						</p>
						<p class="text-xs font-bold text-text-main sm:text-sm">
							{order.shipping_method}
							<span class="text-xs font-normal text-text-muted">
								({formatIDR(Number(order.shipping_price) || 0)})
							</span>
						</p>
					</div>
				</div>

				<div class="flex items-start gap-2.5 sm:col-span-2">
					<MapPin size={16} class="mt-0.5 shrink-0 text-primary" />
					<div class="min-w-0 flex-1">
						<p class="text-micro font-semibold uppercase text-text-muted">
							{STRINGS.ORDER.SHIPPING_ADDRESS}
						</p>
						<p class="text-xs leading-relaxed text-text-main sm:text-sm">
							{order.shipping_address || STRINGS.ORDER.NO_ADDRESS}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div
			class="space-y-1.5 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs sm:space-y-2 sm:p-5 sm:text-sm"
		>
			<div class="flex justify-between text-text-muted">
				<span>{STRINGS.CART.SUBTOTAL}</span>
				<span class="font-medium text-text-main">{formatIDR(itemsSubtotal)}</span>
			</div>
			<div class="flex justify-between text-text-muted">
				<span>{STRINGS.ORDER.SHIPPING_METHOD}</span>
				<span class="font-medium text-text-main"
					>{formatIDR(Number(order.shipping_price) || 0)}</span
				>
			</div>
			<div class="flex items-baseline justify-between border-t border-primary/20 pt-2 font-bold">
				<span class="text-sm text-text-main sm:text-base">{STRINGS.ORDER.GRAND_TOTAL}</span>
				<span class="text-lg text-primary sm:text-xl">{formatIDR(Number(order.total))}</span>
			</div>
		</div>
	</div>
</ModalShell>
