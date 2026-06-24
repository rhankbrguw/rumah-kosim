<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { formatIDR } from '$lib/utils/currency.js';
	import { fade, scale } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	export let order: Record<string, any>;

	const dispatch = createEventDispatcher();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 pb-6 pt-24 backdrop-blur-sm" transition:fade={{ duration: 200 }}>
	<div class="w-full max-w-2xl overflow-hidden rounded-2xl bg-surface/95 shadow-2xl backdrop-blur-md" transition:scale={{ duration: 200, start: 0.95 }}>
		<div class="flex items-center justify-between border-b border-secondary/30 px-6 py-4">
			<h2 class="text-xl font-bold text-text-main">Order #{order.id} Details</h2>
			<button class="rounded-full p-2 text-secondary transition-colors hover:bg-secondary/20 hover:text-text-main" on:click={() => dispatch('close')}>
				<X size={20} />
			</button>
		</div>
		
		<div class="max-h-[60vh] overflow-y-auto p-6">
			<h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">Purchased Items</h3>
			<div class="space-y-4">
				{#each order.items || [] as item}
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
						<p class="font-medium">{order.username || 'Unknown'}</p>
					</div>
					<div>
						<p class="mb-1 text-xs text-text-muted">Tracking Number</p>
						<p class="font-mono font-medium text-primary">{order.tracking_number || 'Not updated'}</p>
					</div>
					<div class="sm:col-span-2">
						<p class="mb-1 text-xs text-text-muted">Shipping Address</p>
						<p class="font-medium">{order.shipping_address || 'No address provided'}</p>
					</div>
					<div class="sm:col-span-2 flex justify-between border-t border-secondary/20 pt-3">
						<p class="text-text-muted">Shipping Method ({order.shipping_method})</p>
						<p class="font-bold">{formatIDR(order.shipping_price || 0)}</p>
					</div>
				</div>
			</div>
			
			<div class="mt-6 flex items-center justify-between rounded-xl bg-primary/10 p-4">
				<span class="font-bold text-text-main">Grand Total</span>
				<span class="text-xl font-bold text-primary">{formatIDR(order.total)}</span>
			</div>
		</div>
	</div>
</div>
