<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	
	import ProductTable from './components/ProductTable.svelte';
	import OrderTable from './components/OrderTable.svelte';
	import { toast } from 'svelte-sonner';
	import AdminModals from './components/AdminModals.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let state: {
		activeTab: string;
		searchTerm: string;
		modals: { add: boolean; edit: boolean };
		editingProduct: { id: number; title: string; price: number; quantity: number; image: string } | null;
	} = {
		activeTab: 'products',
		searchTerm: '',
		modals: { add: false, edit: false },
		editingProduct: null
	};

	async function handleUploadImage(e: CustomEvent) {
		const { event, id } = e.detail;
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file || !['image/jpeg', 'image/png', 'image/gif'].includes(file.type))
			return toast.error('Invalid image');

		try {
			const uploadData = new FormData();
			uploadData.append('image', file);
			
			const res = await fetch('/admin/api/upload', {
				method: 'POST',
				body: uploadData
			});
			if (!res.ok) throw new Error('Upload failed');
			const result = await res.json();
			const path = result.imagePath;

			if (id) {
				const updateData = new FormData();
				updateData.append('id', id.toString());
				updateData.append('image', path);
				
				const updateRes = await fetch('?/updateImage', {
					method: 'POST',
					body: updateData
				});
				if (!updateRes.ok) throw new Error('Failed to update image path');
				await invalidateAll();
				toast.success('Image updated');
			} else {
				toast.success('Image uploaded: ' + path);
			}
		} catch (err: any) {
			toast.error(err.message || 'Upload failed');
		}
	}
</script>

<div class="min-h-screen bg-surface-alt">
	<div class="container mx-auto px-4 py-8 sm:px-8">
		<div class="mb-6 mt-16 sm:mt-20"></div>

		<div class="mb-6 flex gap-2">
			{#each [{ id: 'products', label: STRINGS.ADMIN.TABS.PRODUCTS }, { id: 'orders', label: STRINGS.ADMIN.TABS.ORDERS }] as tab}
				<button
					class="rounded-md px-4 py-2 text-sm font-medium transition-colors sm:text-base {state.activeTab ===
					tab.id
						? 'bg-primary text-text-inverse'
						: 'bg-surface text-text-main'}"
					on:click={() => {
						state.activeTab = tab.id;
					}}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		{#if state.activeTab === 'products'}
			<ProductTable
				bind:searchTerm={state.searchTerm}
				products={data.products}
				on:addProduct={() => (state.modals.add = true)}
				on:uploadImage={handleUploadImage}
				on:editStock={(e) => {
					state.editingProduct = e.detail;
					state.modals.edit = true;
				}}
				on:deleteProduct={handleDeleteProduct}
			/>
		{:else}
			<OrderTable
				orders={data.orders}
			/>
		{/if}

		<AdminModals
			bind:modals={state.modals}
			bind:editingProduct={state.editingProduct}
			{handleUploadImage}
			productForm={data.productForm}
			stockForm={data.stockForm}
		/>
	</div>
</div>
