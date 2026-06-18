<script lang="ts">
	import ProductModal from '../../admin/components/ProductModal.svelte';
	import StockModal from '../../admin/components/StockModal.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let modals: { add: boolean, edit: boolean };
	export let editingProduct: { id: number, title: string, price: number, quantity: number, image: string } | null;

	export let productForm: SuperValidated<Record<string, unknown>>;
	export let stockForm: SuperValidated<Record<string, unknown>>;

	export let handleUploadImage: (e: CustomEvent) => void;
</script>

{#if modals.add}
	<ProductModal
		data={productForm}
		on:close={() => (modals.add = false)}
		on:uploadImage={handleUploadImage}
	/>
{/if}

{#if modals.edit}
	<StockModal
		data={stockForm}
		{editingProduct}
		on:close={() => (modals.edit = false)}
	/>
{/if}
