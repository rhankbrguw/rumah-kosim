<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Info, Tag, Image as ImageIcon } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { ANIMATION } from '$lib/constants/config';
	import { STRINGS } from '$lib/constants/strings.js';
	import ModalShell from '$lib/components/ModalShell.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import ProductModalPricingTab from './ProductModalPricingTab.svelte';
	import ProductModalImageTab from './ProductModalImageTab.svelte';
	import ProductModalBasicTab from './ProductModalBasicTab.svelte';

	export let data: SuperValidated<{
		id?: number;
		title: string;
		image: string;
		description: string;
		price: number;
		quantity: number;
	}>;
	export let mode: 'add' | 'edit' = 'add';
	export let editingProduct: {
		id: number;
		title: string;
		price: number;
		quantity: number;
		image: string;
		description?: string;
	} | null = null;

	const dispatch = createEventDispatcher();
	const { form, errors, enhance, message } = superForm(data, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				dispatch('close');
				setTimeout(() => window.location.reload(), ANIMATION.REDIRECT_DELAY_MS);
			}
		}
	});

	let activeTab = 'basic';
	$: if (mode === 'edit' && editingProduct) {
		$form.id = editingProduct.id;
		$form.title = editingProduct.title;
		$form.description = editingProduct.description || editingProduct.title;
		$form.price = editingProduct.price;
		$form.quantity = editingProduct.quantity;
		$form.image = editingProduct.image;
	}

	function handleFileChange(event: CustomEvent) {
		dispatch('uploadImage', {
			event: event.detail.event,
			onSuccess: (path: string) => ($form.image = path)
		});
	}
</script>

<ModalShell
	title={mode === 'add'
		? STRINGS.ADMIN.MODALS.ADD_PRODUCT.TITLE
		: STRINGS.ADMIN.MODALS.EDIT_PRODUCT.TITLE}
	panelClass="flex max-h-[88vh] flex-col overflow-hidden"
	contentClass="flex min-h-0 flex-1 flex-col p-0"
	on:close={() => dispatch('close')}
>
	<div class="flex shrink-0 border-b border-surface-alt bg-surface-alt/40 px-2">
		{#each [{ id: 'basic', icon: Info, label: STRINGS.ADMIN.MODALS.TABS.BASIC }, { id: 'pricing', icon: Tag, label: STRINGS.ADMIN.MODALS.TABS.PRICING }, { id: 'image', icon: ImageIcon, label: STRINGS.ADMIN.MODALS.TABS.IMAGE }] as tab (tab.id)}
			<button
				class="flex min-h-11 items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm {activeTab ===
				tab.id
					? 'border-primary font-semibold text-primary'
					: 'border-transparent text-text-muted hover:text-text-main'}"
				on:click={() => (activeTab = tab.id)}
				type="button"
			>
				<svelte:component this={tab.icon} size={15} />
				{tab.label}
			</button>
		{/each}
	</div>

	<form
		method="POST"
		action={mode === 'add' ? '?/addProduct' : '?/editProduct'}
		use:enhance
		class="flex-1 overflow-y-auto p-4 sm:p-6"
	>
		{#if $message}
			<div class="mb-4 rounded-lg bg-primary/10 p-3 text-xs text-primary sm:text-sm">
				{$message}
			</div>
		{/if}
		{#if mode === 'edit'}<input type="hidden" name="id" value={$form.id} />{/if}

		<div class={activeTab === 'basic' ? 'block' : 'hidden'}>
			<ProductModalBasicTab
				{activeTab}
				bind:title={$form.title}
				bind:description={$form.description}
				errors={$errors}
			/>
		</div>
		<div class={activeTab === 'pricing' ? 'block' : 'hidden'}>
			<ProductModalPricingTab
				bind:price={$form.price}
				bind:quantity={$form.quantity}
				priceError={$errors.price}
				quantityError={$errors.quantity}
			/>
		</div>
		<div class={activeTab === 'image' ? 'block' : 'hidden'}>
			<ProductModalImageTab
				bind:image={$form.image}
				error={$errors.image}
				on:uploadImage={handleFileChange}
			/>
		</div>

		<div class="mt-6 flex justify-end gap-2.5 border-t border-surface-alt pt-4">
			<button
				type="button"
				class="min-h-11 cursor-pointer rounded-lg border border-secondary/30 bg-surface px-4 py-2 text-xs font-medium text-text-main transition-colors hover:bg-surface-alt sm:text-sm"
				on:click={() => dispatch('close')}>{STRINGS.ADMIN.MODALS.ADD_PRODUCT.CANCEL}</button
			>
			<button
				type="submit"
				class="min-h-11 cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
			>
				{mode === 'add'
					? STRINGS.ADMIN.MODALS.ADD_PRODUCT.SUBMIT
					: STRINGS.ADMIN.MODALS.EDIT_PRODUCT.SUBMIT}
			</button>
		</div>
	</form>
</ModalShell>
