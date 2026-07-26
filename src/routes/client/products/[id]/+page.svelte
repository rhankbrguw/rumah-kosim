<script lang="ts">
	import ProductDetail from '$lib/components/ProductDetail.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
	const { product, reviews, totalReviews, reviewPage, limit } = data;
</script>

{#if product}
	<ProductDetail {product} reviews={reviews || []} {totalReviews} {reviewPage} {limit} />
{:else}
	<div class="flex min-h-[400px] items-center justify-center">
		<p>Product not found</p>
	</div>
{/if}
