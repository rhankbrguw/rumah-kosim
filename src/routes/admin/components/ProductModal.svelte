<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X, Info, Tag, Image as ImageIcon } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { ANIMATION } from '$lib/constants/config';
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

	let activeTab = 'basic'; // 'basic' | 'pricing' | 'image'
	$: if (mode === 'edit' && editingProduct) {
		$form.id = editingProduct.id;
		$form.title = editingProduct.title;
		$form.description = editingProduct.description || editingProduct.title;
		$form.price = editingProduct.price;
		$form.quantity = editingProduct.quantity;
		$form.image = editingProduct.image;
	}

	function handleFileChange(e: Event) {
		dispatch('uploadImage', {
			event: e,
			onSuccess: (path: string) => {
				$form.image = path;
			}
		});
	}
</script>

<div
	class="bg-surface-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 pb-6 pt-24 backdrop-blur-sm"
	transition:fade={{ duration: 200 }}
>
	<div
		class="w-full max-w-lg overflow-hidden rounded-2xl bg-surface/95 shadow-2xl backdrop-blur-md"
		transition:scale={{ duration: 200, start: 0.95 }}
	>
		<div class="flex items-center justify-between border-b border-secondary/30 px-6 py-4">
			<h2 class="text-xl font-bold text-text-main">
				{mode === 'add' ? 'Add New Product' : 'Edit Product'}
			</h2>
			<button
				class="rounded-full p-2 text-secondary hover:bg-secondary/20 hover:text-text-main"
				on:click={() => dispatch('close')}><X size={20} /></button
			>
		</div>

		<div class="flex border-b border-secondary/30 bg-surface-alt/50 px-2">
			{#each [{ id: 'basic', icon: Info, label: 'Basic Info' }, { id: 'pricing', icon: Tag, label: 'Pricing & Stock' }, { id: 'image', icon: ImageIcon, label: 'Image' }] as tab}
				<button
					class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors {activeTab ===
					tab.id
						? 'border-primary text-primary'
						: 'border-transparent text-secondary hover:text-text-main'}"
					on:click={() => (activeTab = tab.id)}
					type="button"
				>
					<svelte:component this={tab.icon} size={16} />
					{tab.label}
				</button>
			{/each}
		</div>

		<form
			method="POST"
			action={mode === 'add' ? '?/addProduct' : '?/editProduct'}
			use:enhance
			class="p-6"
		>
			{#if $message}<div class="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">
					{$message}
				</div>{/if}
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
					on:uploadImage={(e) => handleFileChange(e.detail.event)}
				/>
			</div>

			<div class="mt-8 flex justify-end gap-3 border-t border-secondary/30 pt-6">
				<button
					type="button"
					class="rounded-lg border border-secondary/50 bg-surface px-6 py-2.5 text-sm font-medium text-text-main hover:bg-surface-alt"
					on:click={() => dispatch('close')}>Cancel</button
				>
				<button
					type="submit"
					class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-text-inverse hover:bg-primary-hover hover:shadow-lg"
					>{mode === 'add' ? 'Create Product' : 'Save Changes'}</button
				>
			</div>
		</form>
	</div>
</div>
