<script lang="ts">
	import ReviewModal from '$lib/components/ReviewModal.svelte';
	import { STRINGS } from '$lib/constants/strings';
	import OrderHistoryEmpty from './OrderHistoryEmpty.svelte';
	import OrderHistoryCard from './OrderHistoryCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { APP_CONFIG } from '$lib/constants/config';

	import type { Order } from '$lib/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: {
		history: Order[];
		total: number;
		page: number;
		limit: number;
		reviewForm: SuperValidated<{
			rating: number;
			comment: string;
			orderId: number;
			productId: number;
		}>;
	};

	let expandedOrderId: number | null = null,
		showReviewModal = false,
		selectedProduct: { id: number; title: string; image: string; orderId: number } | null = null;

	function closeReviewModal() {
		showReviewModal = false;
		selectedProduct = null;
	}

	function handlePageChange(e: CustomEvent<number>) {
		const url = new URL($page.url);
		url.searchParams.set('page', e.detail.toString());
		goto(url.toString(), { keepFocus: true });
	}
</script>

<div class="min-h-screen w-full pb-20 pt-24 md:pt-32">
	<div class="mx-auto max-w-5xl px-4 md:px-8">
		<h1 class="mb-8 text-2xl font-bold text-text-main">{STRINGS.ORDER_HISTORY.TITLE}</h1>
		{#if data.history.length === 0}
			<OrderHistoryEmpty />
		{:else}
			<div class="space-y-6">
				{#each data.history as order}
					<OrderHistoryCard
						{order}
						isExpanded={expandedOrderId === order.id}
						on:toggle={() => (expandedOrderId = expandedOrderId === order.id ? null : order.id)}
						openReviewModal={(productData) => {
							selectedProduct = productData;
							showReviewModal = true;
						}}
					/>
				{/each}
			</div>
			<div class="mt-8">
				<Pagination currentPage={data.page} totalItems={data.total} itemsPerPage={APP_CONFIG.DEFAULT_PAGINATION_LIMIT} on:pageChange={handlePageChange} />
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
