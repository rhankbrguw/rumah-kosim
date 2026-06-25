<script lang="ts">
	import ReviewModal from '$lib/components/ReviewModal.svelte';
	import { toast } from 'svelte-sonner';
	import { STRINGS } from '$lib/constants/strings';
	import OrderItem from './OrderItem.svelte';
	import { formatIDR } from '$lib/utils/currency';

	export let data: any;
	
	let expandedOrderId: number | null = null,
		showReviewModal = false,
		selectedProduct: { id: number, title: string, image: string, orderId: number } | null = null;

	const statusColors: Record<string, string> = {
		Processing: 'bg-primary-light text-primary border-primary',
		Shipped: 'bg-primary-light text-primary-hover border-primary-light',
		Delivered: 'bg-secondary text-text-inverse border-secondary',
		Cancelled: 'bg-danger-light text-danger-hover border-danger-light'
	};
	const getStatusColor = (s: string) => statusColors[s] || 'bg-surface-alt text-text-main border-secondary';

	function closeReviewModal() {
		showReviewModal = false;
		selectedProduct = null;
	}
</script>

<div class="min-h-screen w-full pb-20 pt-24 md:pt-32">
	<div class="mx-auto max-w-5xl px-4 md:px-8">
	<h1 class="mb-8 text-2xl font-bold text-text-main">{STRINGS.ORDER_HISTORY.TITLE}</h1>
	{#if data.history.length === 0}
		<div class="flex flex-col items-center justify-center rounded-2xl border border-secondary/10 bg-surface p-12 text-center shadow-sm">
			<p class="text-lg text-text-muted">{STRINGS.ORDER_HISTORY.EMPTY}</p>
			<a href="/client/shop" class="mt-6 rounded-xl bg-primary px-8 py-3 font-bold text-text-inverse transition-colors hover:bg-primary-hover">
				{STRINGS.ORDER_HISTORY.START_SHOPPING}
			</a>
		</div>
	{:else}
		<div class="space-y-6">
			{#each data.history as order}
				<div class="overflow-hidden rounded-2xl border border-secondary/10 bg-surface shadow-sm transition-all hover:shadow-md">
					<div class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
						<div class="flex-1 space-y-1.5">
							<p class="text-sm font-medium text-text-muted">{new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
							<p class="flex items-center gap-2 text-sm text-text-main">
								<span class="text-text-muted">{STRINGS.ORDER_HISTORY.TRACKING}</span>
								<span class="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{order.tracking_number}</span>
							</p>
							<div class="pt-1">
								<span class={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
									{order.status}
								</span>
							</div>
						</div>
						<div class="flex items-center justify-between sm:flex-col sm:items-end sm:gap-3">
							<p class="text-lg font-bold text-text-main">{formatIDR(order.total)}</p>
							<button
								class="text-sm font-bold text-primary transition-colors hover:text-primary-hover hover:underline"
								on:click={() => (expandedOrderId = expandedOrderId === order.id ? null : order.id)}
							>
								{expandedOrderId === order.id ? STRINGS.ORDER_HISTORY.HIDE_DETAILS : STRINGS.ORDER_HISTORY.VIEW_DETAILS}
							</button>
						</div>
					</div>

					{#if expandedOrderId === order.id}
						<div class="border-t border-secondary/10 bg-surface-alt/50 p-6 md:p-8">
							<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
								<div class="lg:col-span-1">
									<h4 class="mb-4 text-sm font-bold uppercase tracking-wide text-text-main">{STRINGS.ORDER_HISTORY.SHIPPING_DETAILS}</h4>
									<div class="space-y-4 text-sm text-text-muted">
										<div>
											<span class="mb-1 block font-semibold text-text-main">{STRINGS.ORDER_HISTORY.METHOD}</span>
											<span>{order.shipping_method}</span>
										</div>
										<div>
											<span class="mb-1 block font-semibold text-text-main">{STRINGS.ORDER_HISTORY.ADDRESS}</span>
											<span class="block leading-relaxed">{order.shipping_address}</span>
										</div>
									</div>
								</div>
								<div class="lg:col-span-2">
									<h4 class="mb-4 text-sm font-bold uppercase tracking-wide text-text-main">{STRINGS.ORDER_HISTORY.ORDER_ITEMS}</h4>
									<div class="divide-y divide-secondary/10">
										{#each order.items as item}
											<div class="flex py-4 w-full first:pt-0 last:pb-0">
												<OrderItem
													{item}
													orderStatus={order.status}
													orderId={order.id}
													openReviewModal={(productData) => {
														selectedProduct = productData;
														showReviewModal = true;
													}}
												/>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	</div>
</div>

<ReviewModal
	data={data.reviewForm}
	product={selectedProduct}
	isOpen={showReviewModal}
	on:close={closeReviewModal}
/>
