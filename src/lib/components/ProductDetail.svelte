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

<div class="min-h-screen w-full bg-surface px-3.5 pb-16 pt-20 sm:px-6 md:pt-28">
	<a
		href="/client/shop"
		class="mx-auto mb-4 block max-w-5xl text-xs font-semibold text-text-muted transition-colors hover:text-primary sm:text-sm md:mb-6"
	>
		&larr; Back to Shop
	</a>

	<div class="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
		<div class="flex items-start justify-center">
			<img
				src={product.image ? product.image.replace('../', '/') : STRINGS.SHOP.FALLBACK_IMAGE}
				alt={product.title}
				class="max-h-72 object-contain transition-transform duration-300 hover:scale-105 sm:max-h-96"
			/>
		</div>

		<div class="flex flex-col space-y-6 sm:space-y-8">
			<div class="space-y-4 sm:space-y-5">
				<div>
					<h1 class="text-lg font-bold leading-snug text-text-main sm:text-2xl lg:text-3xl">
						<i>{product.title}</i>
					</h1>
					<p class="mt-1.5 text-base font-bold text-primary sm:text-xl">
						{formatIDR(product.price)}
					</p>

					<div class="mt-2.5 flex items-center gap-2.5">
						<div class="flex items-center text-primary">
							<Star size={14} fill="currentColor" />
							<span class="ml-1.5 text-xs font-bold text-text-main sm:text-sm"
								>{Number(product.average_rating || 0).toFixed(1)}</span
							>
							<span class="ml-1 text-xs text-text-muted">({totalReviews} reviews)</span>
						</div>
						<span class="text-xs text-text-muted">• {product.sold_count || 0} sold</span>
					</div>
				</div>
				<p class="text-xs leading-relaxed text-text-muted sm:text-sm">{product.description}</p>

				<div class="flex items-center gap-2 text-xs sm:text-sm">
					<span class="text-text-muted">Stock:</span>
					{#if isOutOfStock}
						<span class="font-medium text-danger">{STRINGS.PRODUCT.OUT_OF_STOCK}</span>
					{:else}
						<span class="font-semibold text-primary">{product.quantity}</span>
					{/if}
				</div>
			</div>

			{#if !isAdmin}
				<div class="mt-4 border-t border-surface-alt pt-4 sm:mt-6 sm:pt-6">
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
