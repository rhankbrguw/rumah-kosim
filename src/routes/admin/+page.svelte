<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	import { uploadImage, updateProductImage } from '$lib/services/adminService';

	import ProductTable from './components/ProductTable.svelte';
	import OrderTable from './components/OrderTable.svelte';
	import { toast } from 'svelte-sonner';
	import AdminModals from './components/AdminModals.svelte';
	import { invalidateAll } from '$app/navigation';
	import { UPLOAD } from '$lib/constants/config.js';

	export let data: import('./$types').PageData;

	let state: {
		activeTab: string;
		searchTerm: string;
		modals: { add: boolean; edit: boolean };
		editingProduct: {
			id: number;
			title: string;
			price: number;
			quantity: number;
			image: string;
		} | null;
	} = {
		activeTab: 'products',
		searchTerm: '',
		modals: { add: false, edit: false },
		editingProduct: null
	};

	async function handleUploadImage(e: CustomEvent) {
		const { event, id, onSuccess } = e.detail;
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		if (!UPLOAD.ALLOWED_TYPES.includes(file.type as (typeof UPLOAD.ALLOWED_TYPES)[number]))
			return toast.error(STRINGS.ADMIN.MESSAGES.INVALID_IMAGE_TYPE);
		if (file.size > UPLOAD.MAX_SIZE_BYTES)
			return toast.error(STRINGS.ADMIN.MESSAGES.INVALID_IMAGE_SIZE);

		try {
			const result = await uploadImage(file);
			const path = result.imagePath;

			if (id) {
				await updateProductImage(id, path);
				await invalidateAll();
				toast.success(STRINGS.TOAST.IMAGE_UPDATED);
			} else {
				if (onSuccess) onSuccess(path);
				toast.success(STRINGS.ADMIN.MESSAGES.UPLOAD_SUCCESS);
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : STRINGS.TOAST.UPLOAD_FAILED);
		}
	}
</script>

<svelte:head>
	<title
		>{state.activeTab === 'orders'
			? STRINGS.META.ADMIN_ORDERS
			: STRINGS.META.ADMIN_DASHBOARD}</title
	>
</svelte:head>

<div class="page-enter min-h-screen py-6 sm:py-10">
	<div class="container mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
		<div class="mb-6 mt-16 sm:mt-20"></div>

		<div
			class="mb-6 inline-flex w-full rounded-2xl border border-surface-alt/70 bg-surface-alt/50 p-1.5 shadow-sm backdrop-blur-md sm:w-auto"
		>
			{#each [{ id: 'products', label: STRINGS.ADMIN.TABS.PRODUCTS }, { id: 'orders', label: STRINGS.ADMIN.TABS.ORDERS }] as tab, index (index)}
				<button
					class="flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:flex-none sm:px-6 sm:text-sm {state.activeTab ===
					tab.id
						? 'bg-surface text-primary shadow-sm'
						: 'text-text-muted hover:text-text-main'}"
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
				searchTerm={data.search || ''}
				currentPage={data.productPage}
				itemsPerPage={data.limit}
				products={data.products}
				on:addProduct={() => (state.modals.add = true)}
				on:uploadImage={handleUploadImage}
				on:editStock={(e) => {
					state.editingProduct = e.detail;
					state.modals.edit = true;
				}}
			/>
		{:else}
			<OrderTable orders={data.orders} currentPage={data.orderPage} itemsPerPage={data.limit} />
		{/if}

		<AdminModals
			bind:modals={state.modals}
			bind:editingProduct={state.editingProduct}
			{handleUploadImage}
			productForm={data.productForm}
			editProductForm={data.editProductForm}
		/>
	</div>
</div>
