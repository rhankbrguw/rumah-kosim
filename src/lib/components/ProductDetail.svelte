<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { STRINGS } from '$lib/constants/strings';
	import { APP_CONFIG } from '$lib/constants/config.js';
	import { formatIDR } from '$lib/utils/currency';
	import { Star } from 'lucide-svelte';
	import ProductCartForm from './ProductCartForm.svelte';
	import ProductEditorialReview from './ProductEditorialReview.svelte';
	import ProductCustomerReviews from './ProductCustomerReviews.svelte';

	export let product: {
		id: number;
		title: string;
		description: string;
		price: number;
		quantity: number;
		image: string;
		sold_count: number;
		average_rating: number;
		editorialReview?: { headline: string; body: string };
	};
	export let reviews: {
		id: number;
		user_name: string;
		rating: number;
		comment: string;
		created_at: string;
	}[] = [];
	export let totalReviews: number = 0;
	export let reviewPage: number = 1;
	export let limit: number = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
	export let quantity: number = 1;

	let user: { role: string } | null = null;
	let isSubmitting = false;
	auth.subscribe(({ user: currentUser }) => (user = currentUser));

	$: isOutOfStock = product?.quantity === 0;
	$: isAdmin = user?.role === 'admin';
</script>

<div class="min-h-screen w-full bg-surface px-4 pb-20 pt-24 md:pt-32">
	<a
		href="/client/shop"
		class="mx-auto mb-6 block max-w-5xl text-sm font-semibold text-text-muted transition-colors hover:text-primary md:mb-8"
	>
		&larr; Back to Shop
	</a>

	<div class="mx-auto grid max-w-5xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
		<div class="flex items-center justify-center lg:sticky lg:top-32">
			<img
				src={product.image ? product.image.replace('../', '/') : STRINGS.SHOP.FALLBACK_IMAGE}
				alt={product.title}
				class="max-h-96 object-contain transition-transform duration-500 hover:scale-105"
			/>
		</div>

		<div class="flex flex-col space-y-8">
			<div class="space-y-5">
				<div>
					<h1 class="text-2xl font-bold text-text-main sm:text-3xl"><i>{product.title}</i></h1>
					<p class="mt-2 text-xl font-semibold text-danger">{formatIDR(product.price)}</p>

					<div class="mt-3 flex items-center gap-3">
						<div class="flex items-center text-primary">
							<Star size={16} fill="currentColor" />
							<span class="ml-1.5 font-bold text-text-main"
								>{Number(product.average_rating || 0).toFixed(1)}</span
							>
							<span class="ml-1 text-sm text-text-muted">({totalReviews} reviews)</span>
						</div>
						<span class="text-sm text-text-muted">• {product.sold_count || 0} sold</span>
					</div>
				</div>
				<p class="leading-relaxed text-text-muted">{product.description}</p>

				<div class="flex items-center gap-2">
					<span class="text-text-muted">Stock:</span>
					{#if isOutOfStock}
						<span class="font-medium text-danger">{STRINGS.PRODUCT.OUT_OF_STOCK}</span>
					{:else}
						<span class="font-medium text-primary">{product.quantity}</span>
					{/if}
				</div>
			</div>

			{#if !isAdmin}
				<div class="mt-6 border-t border-secondary/10 pt-6">
					<ProductCartForm
						productId={product.id}
						maxQuantity={product.quantity}
						bind:quantity
						{isSubmitting}
						{isOutOfStock}
					/>
				</div>
			{/if}
		</div>
	</div>

	{#if product.editorialReview}
		<ProductEditorialReview review={product.editorialReview} />
	{/if}

	<ProductCustomerReviews {reviews} {totalReviews} {reviewPage} {limit} />
</div>
