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
		Delivered: 'bg-secondary text-text-main border-secondary',
		Cancelled: 'bg-danger-light text-danger-hover border-danger-light'
	};
	const getStatusColor = (s: string) => statusColors[s] || 'bg-surface-alt text-text-main border-secondary';

	function closeReviewModal() {
		showReviewModal = false;
		selectedProduct = null;
	}
</script>

<div class="container mx-auto px-4 py-8 lg:max-w-5xl">
	<h1 class="mb-6 text-2xl font-bold text-text-main">Order History</h1>
	{#if data.history.length === 0}
		<div
			class="rounded-lg border border-surface-alt bg-surface-alt p-12 text-center text-text-muted"
		>
			<p>You haven't placed any orders yet.</p>
			<a
				href="/client/shop"
				class="mt-4 inline-block rounded-md bg-primary px-6 py-2 text-white hover:bg-primary-hover"
				>Start Shopping</a
			>
		</div>
	{:else}
		<div class="space-y-6">
			{#each data.history as order}
				<div class="rounded-lg border border-surface-alt bg-surface shadow-sm">
					<div class="flex flex-col justify-between gap-4 p-6 sm:flex-row">
						<div>
							<p class="text-sm text-text-muted">{new Date(order.date).toLocaleDateString()}</p>
							<p class="mt-1 text-sm">
								Tracking: <span class="font-mono text-primary">{order.tracking_number}</span>
							</p>
						</div>
						<div class="flex flex-col gap-2 sm:items-end">
							<div
								class={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
							>
								{order.status}
							</div>
							<p class="text-lg font-semibold text-text-main">{formatIDR(order.total)}</p>
						</div>
						<button
							class="text-sm text-primary hover:underline"
							on:click={() => (expandedOrderId = expandedOrderId === order.id ? null : order.id)}
						>
							{expandedOrderId === order.id ? 'Hide' : 'View'} Details
						</button>
					</div>

					{#if expandedOrderId === order.id}
						<div class="border-t border-surface-alt bg-surface-alt p-6">
							<div class="space-y-6">
								<div class="rounded-lg border border-surface-alt bg-surface p-4">
									<h4 class="mb-3 text-sm font-medium text-text-main">Shipping Details</h4>
									<div class="text-sm text-text-muted">
										<p>Method: {order.shipping_method}</p>
										<p>Address: {order.shipping_address}</p>
									</div>
								</div>
								<div>
									<h4 class="mb-3 text-sm font-medium text-text-main">Order Items</h4>
									<div class="space-y-4">
										{#each order.items as item}
											<OrderItem
												{item}
												orderStatus={order.status}
												orderId={order.id}
												openReviewModal={(productData) => {
													selectedProduct = productData;
													showReviewModal = true;
												}}
											/>
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

<ReviewModal
	data={data.reviewForm}
	product={selectedProduct}
	isOpen={showReviewModal}
	on:close={closeReviewModal}
/>
