<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { Pencil } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import ProductDeleteButton from './ProductDeleteButton.svelte';

	export let products: {
		id: number;
		title: string;
		price: number;
		quantity: number;
		image: string;
	}[] = [];

	const dispatch = createEventDispatcher();
</script>

<div
	class="hidden overflow-x-auto rounded-xl border border-surface-alt bg-surface shadow-sm md:block"
>
	<table class="w-full whitespace-nowrap text-center text-xs lg:text-sm">
		<thead>
			<tr class="border-b border-surface-alt text-secondary">
				<th class="px-3 py-3.5 text-left font-semibold">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.TITLE}</th
				>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.PRICE}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.STOCK}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.PICTURE}</th>
				<th class="px-3 py-3.5 font-semibold">{STRINGS.ADMIN.PRODUCT_TABLE.COLS.ACTION}</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-surface-alt/60">
			{#each products as product (product.id)}
				<tr class="transition-colors hover:bg-surface-alt/40">
					<td class="max-w-[240px] px-3 py-3 text-left font-medium text-text-main">
						<span class="block truncate" title={product.title}>{product.title}</span>
					</td>
					<td class="px-3 py-3 font-semibold text-primary">{formatIDR(product.price)}</td>
					<td class="px-3 py-3 font-medium text-text-main">{product.quantity}</td>
					<td class="px-3 py-3">
						<div class="flex items-center justify-center gap-2.5">
							<img
								src={product.image}
								alt={product.title}
								class="h-9 w-9 rounded-lg border border-surface-alt object-cover shadow-sm"
							/>
							<label
								class="cursor-pointer rounded-lg bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-main shadow-sm transition-colors hover:bg-secondary hover:text-text-inverse"
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
					<td class="px-3 py-3">
						<div class="flex justify-center gap-1.5">
							<button
								class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-primary text-text-inverse transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
								title={STRINGS.ADMIN.PRODUCT_TABLE.EDIT_STOCK}
								on:click={() => dispatch('editStock', product)}
							>
								<Pencil size={15} />
							</button>
							<ProductDeleteButton {product} />
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
