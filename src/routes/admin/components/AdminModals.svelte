<script lang="ts">
	import ProductModal from '../../admin/components/ProductModal.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let modals: { add: boolean; edit: boolean };
	export let editingProduct: {
		id: number;
		title: string;
		price: number;
		quantity: number;
		image: string;
	} | null;

	export let productForm: SuperValidated<{
		id?: number;
		title: string;
		image: string;
		description: string;
		price: number;
		quantity: number;
	}>;
	export let editProductForm: SuperValidated<{
		id?: number;
		title: string;
		image: string;
		description: string;
		price: number;
		quantity: number;
	}>;

	export let handleUploadImage: (e: CustomEvent) => void;
</script>

{#if modals.add}
	<ProductModal
		mode="add"
		data={productForm}
		on:close={() => (modals.add = false)}
		on:uploadImage={handleUploadImage}
	/>
{/if}

{#if modals.edit}
	<ProductModal
		mode="edit"
		data={editProductForm}
		{editingProduct}
		on:close={() => {
			modals.edit = false;
			editingProduct = null;
		}}
		on:uploadImage={handleUploadImage}
	/>
{/if}
