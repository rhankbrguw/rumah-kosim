<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Pencil, Trash2, Plus } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';

	export let products: { id: number, title: string, price: number, quantity: number, image: string }[] = [];
	export let searchTerm: string = '';

	const dispatch = createEventDispatcher();
</script>

<div class="rounded-2xl border border-surface-alt/50 bg-surface/80 p-6 shadow-sm backdrop-blur-md" transition:fade>
	<div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
		<input
			type="text"
			class="w-full rounded-lg border border-secondary px-4 py-2 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:w-64"
			placeholder={STRINGS.ADMIN.PRODUCT_TABLE.SEARCH_PLACEHOLDER}
			bind:value={searchTerm}
		/>
		<button
			class="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-text-inverse transition-colors hover:bg-primary-hover"
			on:click={() => dispatch('addProduct')}
		>
			<Plus size="18" />
			{STRINGS.ADMIN.PRODUCT_TABLE.ADD_BUTTON}
		</button>
	</div>

	<div class="grid gap-4 md:hidden">
		{#each products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())) as product (product.id)}
			<div class="flex flex-col rounded-xl border border-surface-alt bg-surface-alt/20 p-4 shadow-sm">
				<div class="mb-3 flex items-start gap-4">
					<img src={product.image} alt={product.title} class="h-16 w-16 rounded-lg object-cover border border-secondary/20" />
					<div class="flex-1">
						<h3 class="line-clamp-1 font-bold text-text-main">{product.title}</h3>
						<p class="text-sm font-semibold text-primary">{formatIDR(product.price)}</p>
						<p class="text-xs text-text-muted">Stock: <span class="font-medium text-text-main">{product.quantity}</span></p>
					</div>
				</div>
				<div class="flex items-center gap-2 border-t border-surface-alt/50 pt-3">
					<label class="flex-1 cursor-pointer rounded-lg bg-surface-alt py-2 text-center text-xs font-medium text-text-main transition-colors hover:bg-secondary hover:text-text-inverse">
						<input type="file" class="hidden" on:change={(e) => dispatch('uploadImage', { event: e, id: product.id })} accept="image/*" />
						{STRINGS.ADMIN.PRODUCT_TABLE.UPLOAD}
					</label>
					<button class="rounded-lg bg-primary p-2 text-text-inverse transition-colors hover:bg-primary-hover" on:click={() => dispatch('editStock', product)}>
						<Pencil size="16" />
					</button>
					<form method="POST" action="?/deleteProduct" use:enhance on:submit={(e) => {
						if (!confirm('Are you sure you want to delete this product?')) e.preventDefault();
					}}>
						<input type="hidden" name="id" value={product.id} />
						<button type="submit" class="rounded-lg bg-danger p-2 text-text-inverse transition-colors hover:bg-danger-hover">
							<Trash2 size="16" />
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>

	<div class="hidden overflow-hidden rounded-xl border border-surface-alt bg-surface shadow-sm md:block">
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
				{#each products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())) as product (product.id)}
					<tr class="border-b border-surface-alt transition-colors hover:bg-surface-alt/50">
						<td class="py-4 font-medium text-text-main">{product.title}</td>
						<td class="py-4 font-semibold text-primary">{formatIDR(product.price)}</td>
						<td class="py-4 text-text-main">{product.quantity}</td>
						<td class="py-4">
							<div class="flex items-center justify-center gap-3">
								<img src={product.image} alt={product.title} class="h-10 w-10 rounded-lg object-cover shadow-sm" />
								<label class="cursor-pointer rounded-md bg-surface-alt px-3 py-1 text-xs font-medium text-text-main transition-colors hover:bg-secondary hover:text-text-inverse">
									<input type="file" class="hidden" on:change={(e) => dispatch('uploadImage', { event: e, id: product.id })} accept="image/*" />
									{STRINGS.ADMIN.PRODUCT_TABLE.UPLOAD}
								</label>
							</div>
						</td>
						<td class="py-4">
							<div class="flex justify-center gap-2">
								<button class="rounded-md bg-primary p-1.5 text-text-inverse transition-colors hover:bg-primary-hover" on:click={() => dispatch('editStock', product)}>
									<Pencil size="16" />
								</button>
								<form method="POST" action="?/deleteProduct" use:enhance on:submit={(e) => {
									if (!confirm('Are you sure you want to delete this product?')) e.preventDefault();
								}}>
									<input type="hidden" name="id" value={product.id} />
									<button type="submit" class="rounded-md bg-danger p-1.5 text-text-inverse transition-colors hover:bg-danger-hover">
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
</div>
