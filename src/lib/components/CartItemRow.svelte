<script lang="ts">
	import { enhance } from '$app/forms';
	import { Trash2, Minus, Plus } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import type { CartItem } from '$lib/stores/cartStore.js';
	import { formatIDR } from '$lib/utils/currency.js';

	export let item: CartItem;
	export let isSubmitting = false;
	export let handleForm: () => (params: { update: () => Promise<void> }) => Promise<void>;
</script>

<div
	class="flex gap-3.5 rounded-2xl border border-surface-alt bg-surface p-3.5 shadow-sm transition-all hover:border-primary/30 sm:gap-4 sm:p-4"
>
	<a href="/client/products/{item.product_id}" class="shrink-0">
		<img
			src={item.image}
			alt={item.title}
			class="w-18 h-24 rounded-lg border border-surface-alt object-cover shadow-sm transition-transform hover:scale-105 sm:h-28 sm:w-20"
		/>
	</a>
	<div class="flex min-w-0 flex-1 flex-col justify-between py-0.5">
		<div>
			<div class="flex items-start justify-between gap-2">
				<a
					href="/client/products/{item.product_id}"
					class="line-clamp-2 text-xs font-bold text-text-main transition-colors hover:text-primary sm:text-sm"
				>
					{item.title}
				</a>
				<form method="POST" action="?/remove" use:enhance={handleForm}>
					<input type="hidden" name="productId" value={item.product_id} />
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-danger-light hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
						aria-label={STRINGS.CART.REMOVE}
						title={STRINGS.CART.REMOVE}
					>
						<Trash2 size={15} />
					</button>
				</form>
			</div>
			<p class="mt-0.5 text-xs text-text-muted">
				{formatIDR(Number(item.price))}
				<span class="text-micro opacity-70">{STRINGS.CART.PRICE_PER_COPY}</span>
			</p>
		</div>

		<div class="mt-2.5 flex items-center justify-between border-t border-surface-alt/70 pt-2">
			<div
				class="inline-flex items-center rounded-lg border border-surface-alt bg-surface-alt/60 p-0.5"
			>
				<form method="POST" action="?/updateQuantity" use:enhance={handleForm}>
					<input type="hidden" name="productId" value={item.product_id} />
					<input type="hidden" name="delta" value="-1" />
					<button
						type="submit"
						disabled={item.quantity <= 1 || isSubmitting}
						class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-text-main transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
						aria-label={STRINGS.CART.DECREASE_QUANTITY}
					>
						<Minus size={13} />
					</button>
				</form>
				<span class="min-w-8 text-center text-xs font-bold text-text-main">{item.quantity}</span>
				<form method="POST" action="?/updateQuantity" use:enhance={handleForm}>
					<input type="hidden" name="productId" value={item.product_id} />
					<input type="hidden" name="delta" value="1" />
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-text-main transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
						aria-label={STRINGS.CART.INCREASE_QUANTITY}
					>
						<Plus size={13} />
					</button>
				</form>
			</div>
			<span class="text-xs font-bold text-primary sm:text-sm">
				{formatIDR(Number(item.price) * Number(item.quantity))}
			</span>
		</div>
	</div>
</div>
