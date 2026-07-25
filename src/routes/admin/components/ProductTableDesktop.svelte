<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { Pencil, Trash2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';

	export let products: {
		id: number;
		title: string;
		price: number;
		quantity: number;
		image: string;
	}[] = [];
	export let searchTerm: string = '';

	const dispatch = createEventDispatcher();
</script>

<div
	class="hidden overflow-hidden rounded-xl border border-surface-alt bg-surface shadow-sm md:block"
>
	<table class="w-full whitespace-nowrap text-center">
		<thead>
			<tr class="border-b border-surface-alt text-secondary">
				<th class="pb-4 font-medium">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.TITLE}</th>
				<th class="pb-4 font-medium">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.PRICE}</th>
				<th class="pb-4 font-medium">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.STOCK}</th>
				<th class="pb-4 font-medium">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.PICTURE}</th>
				<th class="pb-4 font-medium">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.ACTION}</th>
			</tr>
		</thead>
		<tbody>
			{#each products.filter((p) => p.title
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) as product (product.id)}
				<tr class="border-b border-surface-alt transition-colors hover:bg-surface-alt/50">
					<td class="py-4 font-medium text-text-main">{product.title}</td>
					<td class="py-4 font-semibold text-primary">{formatIDR(product.price)}</td>
					<td class="py-4 text-text-main">{product.quantity}</td>
					<td class="py-4">
						<div class="flex items-center justify-center gap-3">
							<img
								src={product.image}
								alt={product.title}
								class="h-10 w-10 rounded-lg object-cover shadow-sm"
							/>
							<label
								class="cursor-pointer rounded-md bg-surface-alt px-3 py-1 text-xs font-medium text-text-main transition-colors hover:bg-secondary hover:text-text-inverse"
							>
								<input
									type="file"
									class="hidden"
									on:change={(e) => dispatch('uploadImage', { event: e, id: product.id })}
									accept="image/*"
								/>
								{STRINGS.ADMIN.PRODUCT_TABLE.UPLOAD}
							</label>
						</div>
					</td>
					<td class="py-4">
						<div class="flex justify-center gap-2">
							<button
								class="rounded-md bg-primary p-1.5 text-text-inverse transition-colors hover:bg-primary-hover"
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
									class="rounded-md bg-danger p-1.5 text-text-inverse transition-colors hover:bg-danger-hover"
								>
									<Trash2 size="16" />
								</button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
