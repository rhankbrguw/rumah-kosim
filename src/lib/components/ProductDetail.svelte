<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { STRINGS } from '$lib/constants/strings';
	import { formatIDR } from '$lib/utils/currency';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';

	export let product: { id: number, title: string, description: string, price: number, quantity: number, image: string, editorialReview?: { headline: string, body: string } };
	export let quantity: number = 1;

	let user: { role: string } | null = null;
	auth.subscribe(({ user: u }) => (user = u));

	$: isOutOfStock = product?.quantity === 0;
	$: isAdmin = user?.role === 'admin';
</script>

<div class="min-h-screen w-full bg-surface px-4 pb-20 pt-24 md:pt-32">
	<a
		href="/client/shop"
		class="mx-auto mb-6 block max-w-6xl text-sm font-semibold text-text-muted transition-colors hover:text-primary md:mb-8"
	>
		&larr; Back to Shop
	</a>

	<div class="mx-auto flex max-w-6xl flex-col items-start gap-8 lg:flex-row lg:gap-12">
		<div
			class="flex w-full items-center justify-center overflow-hidden rounded-3xl border border-surface-alt/50 bg-surface/80 p-8 shadow-sm backdrop-blur-md transition-all hover:shadow-md lg:sticky lg:top-24 lg:w-5/12"
		>
			<img
				src={product.image ? product.image.replace('../', '/') : STRINGS.SHOP.FALLBACK_IMAGE}
				alt={product.title}
				class="max-h-96 object-contain transition-transform duration-500 hover:scale-105"
			/>
		</div>

		<div
			class="flex w-full flex-col justify-start space-y-6 rounded-2xl border border-surface-alt/50 bg-surface/80 p-6 shadow-sm backdrop-blur-md md:w-1/2 md:p-8"
		>
			<div>
				<h1 class="text-2xl font-bold text-text-main sm:text-3xl"><i>{product.title}</i></h1>
				<p class="mt-2 text-xl font-semibold text-danger">{formatIDR(product.price)}</p>
			</div>
			<p class="text-text-muted">{product.description}</p>

			<div class="flex items-center gap-2">
				<span class="text-text-muted">Stock:</span>
				{#if isOutOfStock}
					<span class="font-medium text-danger">{STRINGS.PRODUCT.OUT_OF_STOCK}</span>
				{:else}
					<span class="font-medium text-primary">{product.quantity}</span>
				{/if}
			</div>

			{#if !isAdmin}
				<p class="text-sm text-text-muted">
					<strong>Note:</strong> Agree to our Terms before purchase.
				</p>

				<form method="POST" action="?/addToCart" use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'redirect') {
							window.location.href = result.location;
						} else if (result.type === 'failure') {
							toast.error(String(result.data?.error || 'Error adding to cart'));
						} else {
							toast.success('Added to cart!');
							product.quantity -= quantity;
							await update();
						}
					};
				}}>
					<input type="hidden" name="productId" value={product.id} />
					<input type="hidden" name="quantity" value={quantity} />
					
					<div class="mb-4 flex items-center gap-4">
						<button type="button"
							on:click={() => quantity > 1 && quantity--}
							disabled={quantity <= 1 || isOutOfStock}
							class="flex h-10 w-10 items-center justify-center rounded border border-secondary bg-surface text-text-main hover:bg-surface-alt disabled:opacity-50"
							>-</button
						>
						<span class="text-lg font-medium text-text-main">{isOutOfStock ? 0 : quantity}</span>
						<button type="button"
							on:click={() => quantity < product.quantity && quantity++}
							disabled={quantity >= product.quantity || isOutOfStock}
							class="flex h-10 w-10 items-center justify-center rounded border border-secondary bg-surface text-text-main hover:bg-surface-alt disabled:opacity-50"
							>+</button
						>
					</div>

					<button
						type="submit"
						disabled={isOutOfStock}
						class="w-full rounded-xl bg-primary py-3.5 font-bold text-text-inverse shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
					>
						{STRINGS.PRODUCT.ADD_TO_CART}
					</button>
				</form>
			{/if}
		</div>
	</div>
	{#if product.editorialReview}
		<div
			class="mx-auto mt-12 max-w-6xl rounded-3xl border border-surface-alt/50 bg-surface/80 p-8 shadow-sm backdrop-blur-md md:mt-16 md:p-12"
		>
			<h2 class="mb-8 text-2xl font-bold text-text-main md:text-3xl">Editorial Reviews</h2>
			<div class="flex flex-col gap-8 md:flex-row md:gap-12">
				<div class="md:w-1/3">
					<p class="whitespace-pre-line text-lg font-bold text-primary">
						{product.editorialReview.headline}
					</p>
				</div>
				<div class="md:w-2/3">
					<p class="whitespace-pre-line text-lg leading-relaxed text-text-muted">
						{product.editorialReview.body}
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
