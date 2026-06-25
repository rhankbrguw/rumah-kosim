<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { STRINGS } from '$lib/constants/strings';
	import { formatIDR } from '$lib/utils/currency';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { Star } from 'lucide-svelte';

	export let product: { id: number, title: string, description: string, price: number, quantity: number, image: string, sold_count: number, average_rating: number, editorialReview?: { headline: string, body: string } };
	export let reviews: { id: number, user_name: string, rating: number, comment: string, created_at: string }[] = [];
	export let quantity: number = 1;

	let user: { role: string } | null = null;
	let isSubmitting = false;
	auth.subscribe(({ user: u }) => (user = u));

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
				class="max-h-[28rem] object-contain transition-transform duration-500 hover:scale-105"
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
							<span class="ml-1.5 font-bold text-text-main">{Number(product.average_rating || 0).toFixed(1)}</span>
							<span class="ml-1 text-sm text-text-muted">({reviews.length} reviews)</span>
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
					<form method="POST" action="?/addToCart" use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							if (result.type === 'redirect') window.location.href = result.location;
							else if (result.type === 'failure') {
								toast.error(String(result.data?.error || STRINGS.COMMON.ERROR));
								if (typeof result.data?.redirectTo === 'string') setTimeout(() => window.location.href = result.data.redirectTo, 2500);
							} else {
								toast.success(STRINGS.TOAST.ADDED_TO_CART);
								product.quantity -= quantity;
								await update();
							}
							isSubmitting = false;
						};
					}}>
						<input type="hidden" name="productId" value={product.id} />
						<input type="hidden" name="quantity" value={quantity} />

						<div class="mb-4 flex items-center gap-4">
							<button type="button" on:click={() => quantity > 1 && quantity--} disabled={quantity <= 1 || isOutOfStock || isSubmitting} class="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-surface-alt text-text-main transition-colors hover:border-primary disabled:opacity-50">-</button>
							<span class="min-w-[2rem] text-center text-lg font-medium text-text-main">{isOutOfStock ? 0 : quantity}</span>
							<button type="button" on:click={() => quantity < product.quantity && quantity++} disabled={quantity >= product.quantity || isOutOfStock || isSubmitting} class="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-surface-alt text-text-main transition-colors hover:border-primary disabled:opacity-50">+</button>
						</div>

						<button
							type="submit"
							disabled={isOutOfStock || isSubmitting}
							class="w-full rounded-xl bg-primary py-3.5 font-bold text-text-inverse shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
						>
							{#if isSubmitting}
								<div class="h-5 w-5 animate-spin rounded-full border-2 border-text-inverse border-t-transparent"></div>
								{STRINGS.COMMON.LOADING}
							{:else}
								{STRINGS.PRODUCT.ADD_TO_CART}
							{/if}
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>

	{#if product.editorialReview}
		<div class="mx-auto mt-16 max-w-5xl border-t border-secondary/10 pt-12 md:mt-20 md:pt-16">
			<h2 class="mb-6 text-2xl font-bold text-text-main md:text-3xl">{STRINGS.PRODUCT.EDITORIAL_REVIEWS}</h2>
			<div class="flex flex-col gap-6 md:flex-row md:gap-12">
				<div class="md:w-1/3"><p class="whitespace-pre-line text-lg font-bold text-primary">{product.editorialReview.headline}</p></div>
				<div class="md:w-2/3"><p class="whitespace-pre-line text-lg leading-relaxed text-text-muted">{product.editorialReview.body}</p></div>
			</div>
		</div>
	{/if}

	<div class="mx-auto mt-16 max-w-5xl border-t border-secondary/10 pt-12 md:mt-20 md:pt-16">
		<h2 class="mb-8 text-2xl font-bold text-text-main md:text-3xl">{STRINGS.PRODUCT.CUSTOMER_REVIEWS}</h2>
		
		{#if reviews.length === 0}
			<div class="rounded-2xl border border-secondary/10 bg-surface-alt/30 p-12 text-center text-text-muted">
				{STRINGS.PRODUCT.NO_REVIEWS_YET}
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each reviews as review}
					<div class="rounded-2xl border border-secondary/20 bg-surface/80 p-6 shadow-sm backdrop-blur-md">
						<div class="mb-4 flex items-start justify-between">
							<div>
								<p class="font-bold text-text-main">{review.user_name}</p>
								<p class="text-xs text-text-muted">{new Date(review.created_at).toLocaleDateString()}</p>
							</div>
							<div class="flex text-primary">
								{#each Array(5) as _, i}
									<Star size={14} fill={i < review.rating ? 'currentColor' : 'none'} class={i < review.rating ? 'text-primary' : 'text-secondary'} />
								{/each}
							</div>
						</div>
						<p class="text-sm leading-relaxed text-text-muted">"{review.comment}"</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
