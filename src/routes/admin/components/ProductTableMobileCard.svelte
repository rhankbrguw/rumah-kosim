<script lang="ts">
	import { Pencil, Trash2 } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';

	export let product: {
		id: number;
		title: string;
		price: number;
		quantity: number;
		image: string;
	};

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col rounded-xl border border-surface-alt bg-surface-alt/20 p-4 shadow-sm">
	<div class="mb-3 flex items-start gap-4">
		<img
			src={product.image}
			alt={product.title}
			class="h-16 w-16 rounded-lg border border-secondary/20 object-cover"
		/>
		<div class="flex-1">
			<h3 class="line-clamp-1 font-bold text-text-main">{product.title}</h3>
			<p class="text-sm font-semibold text-primary">{formatIDR(product.price)}</p>
			<p class="text-xs text-text-muted">
				Stock: <span class="font-medium text-text-main">{product.quantity}</span>
			</p>
		</div>
	</div>
	<div class="flex items-center gap-2 border-t border-surface-alt/50 pt-3">
		<label
			class="flex-1 cursor-pointer rounded-lg bg-surface-alt py-2 text-center text-xs font-medium text-text-main transition-colors hover:bg-secondary hover:text-text-inverse"
		>
			<input
				type="file"
				class="hidden"
				on:change={(e) => dispatch('uploadImage', { event: e, id: product.id })}
				accept="image/*"
			/>
			{STRINGS.ADMIN.PRODUCT_TABLE.UPLOAD}
		</label>
		<button
			class="rounded-lg bg-primary p-2 text-text-inverse transition-colors hover:bg-primary-hover"
			on:click={() => dispatch('editStock', product)}
		>
			<Pencil size="16" />
		</button>
		<form
			method="POST"
			action="?/deleteProduct"
			use:enhance
			on:submit={(e) => {
				if (!confirm('Are you sure you want to delete this product?')) e.preventDefault();
			}}
		>
			<input type="hidden" name="id" value={product.id} />
			<button
				type="submit"
				class="rounded-lg bg-danger p-2 text-text-inverse transition-colors hover:bg-danger-hover"
			>
				<Trash2 size="16" />
			</button>
		</form>
	</div>
</div>
