<script lang="ts">
	import ProductDetail from '$lib/components/ProductDetail.svelte';
	import { STRINGS } from '$lib/constants/strings';

	import type { PageData } from './$types';
	export let data: PageData;
	const { product, reviews, totalReviews, reviewPage, limit } = data;
</script>

<svelte:head>
	<title>{product ? product.title : STRINGS.META.PRODUCT_DETAIL}</title>
</svelte:head>

{#if product}
	<ProductDetail {product} reviews={reviews || []} {totalReviews} {reviewPage} {limit} />
{:else}
	<div class="flex min-h-96 items-center justify-center">
		<p>Product not found</p>
	</div>
{/if}
