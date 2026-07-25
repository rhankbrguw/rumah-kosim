<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { STRINGS } from '$lib/constants/strings';
	import { ANIMATION } from '$lib/constants/config';
	export let product: { id: number; quantity: number };
	export let quantity: number = 1;
	export let isOutOfStock: boolean;
	export let isSubmitting: boolean = false;
</script>

<form
	method="POST"
	action="?/addToCart"
	use:enhance={() => {
	isSubmitting = true;
	return async ({ result, update }) => {
		if (result.type === 'redirect') window.location.href = result.location;
		else if (result.type === 'success' || result.type === 'failure') {
			toast.error(String(result.data?.error || STRINGS.COMMON.ERROR));
			if (typeof result.data?.redirectTo === 'string') setTimeout(() => window.location.href = result.data?.redirectTo as string, ANIMATION.REVIEW_REDIRECT_MS);
		} else {
			toast.success(STRINGS.TOAST.ADDED_TO_CART);
			product.quantity -= quantity;
			await update();
		}
		isSubmitting = false;
	};
}}
>
	<input type="hidden" name="productId" value={product.id} />
	<input type="hidden" name="quantity" value={quantity} />

	<div class="mb-4 flex items-center gap-4">
		<button
			type="button"
			on:click={() => quantity > 1 && quantity--}
			disabled={quantity <= 1 || isOutOfStock || isSubmitting}
			class="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-surface-alt text-text-main transition-colors hover:border-primary disabled:opacity-50"
			>-</button
		>
		<span class="min-w-[2rem] text-center text-lg font-medium text-text-main"
			>{isOutOfStock ? 0 : quantity}</span
		>
		<button
			type="button"
			on:click={() => quantity < product.quantity && quantity++}
			disabled={quantity >= product.quantity || isOutOfStock || isSubmitting}
			class="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/20 bg-surface-alt text-text-main transition-colors hover:border-primary disabled:opacity-50"
			>+</button
		>
	</div>

	<button
		type="submit"
		disabled={isOutOfStock || isSubmitting}
		class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-text-inverse shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
	>
		{#if isSubmitting}
			<div
				class="h-5 w-5 animate-spin rounded-full border-2 border-text-inverse border-t-transparent"
			></div>
			{STRINGS.COMMON.LOADING}
		{:else}
			{STRINGS.PRODUCT.ADD_TO_CART}
		{/if}
	</button>
</form>
