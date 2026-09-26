<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { STRINGS } from '$lib/constants/strings';
	import { ANIMATION } from '$lib/constants/config';
	import { Minus, Plus } from 'lucide-svelte';

	export let productId: number;
	export let maxQuantity: number;
	export let quantity: number = 1;
	export let isSubmitting: boolean = false;
	export let isOutOfStock: boolean;
</script>

<div class="mt-6 border-t border-secondary/10 pt-6">
	<form
		method="POST"
		action="?/addToCart"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') window.location.href = result.location;
				else if (result.type === 'failure') {
					const resData = result as { data?: { error?: string; redirectTo?: string } };
					toast.error(String(resData.data?.error || STRINGS.COMMON.ERROR));
					if (resData.data && typeof resData.data.redirectTo === 'string')
						setTimeout(() => (window.location.href = resData.data!.redirectTo!), ANIMATION.REVIEW_REDIRECT_MS);
				} else {
					toast.success(STRINGS.TOAST.ADDED_TO_CART);
					maxQuantity -= quantity;
					await update();
				}
				isSubmitting = false;
			};
		}}
	>
		<input type="hidden" name="productId" value={productId} />
		<input type="hidden" name="quantity" value={quantity} />

		<div class="mb-4 flex items-center gap-3">
			<button
				type="button"
				on:click={() => quantity > 1 && quantity--}
				disabled={quantity <= 1 || isOutOfStock || isSubmitting}
				aria-label={STRINGS.CART.DECREASE_QUANTITY}
				class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-surface-alt bg-surface-alt/70 text-text-main transition-colors hover:border-primary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
			>
				<Minus size={15} />
			</button>
			<span class="min-w-10 text-center text-base font-bold text-text-main"
				>{isOutOfStock ? 0 : quantity}</span
			>
			<button
				type="button"
				on:click={() => quantity < maxQuantity && quantity++}
				disabled={quantity >= maxQuantity || isOutOfStock || isSubmitting}
				aria-label={STRINGS.CART.INCREASE_QUANTITY}
				class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-surface-alt bg-surface-alt/70 text-text-main transition-colors hover:border-primary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
			>
				<Plus size={15} />
			</button>
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
</div>
