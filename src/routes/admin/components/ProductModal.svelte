<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X, Info, Tag, Image as ImageIcon } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: SuperValidated<any>;
	export let mode: 'add' | 'edit' = 'add';
	export let editingProduct: { id: number, title: string, price: number, quantity: number, image: string, description?: string } | null = null;
	const dispatch = createEventDispatcher();
	const { form, errors, enhance, message } = superForm(data, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				dispatch('close');
				setTimeout(() => window.location.reload(), 1000);
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
		dispatch('uploadImage', { event: e, onSuccess: (path: string) => { $form.image = path; } });
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 pb-6 pt-24 backdrop-blur-sm" transition:fade={{ duration: 200 }}>
	<div class="w-full max-w-[500px] overflow-hidden rounded-2xl bg-surface/95 shadow-2xl backdrop-blur-md" transition:scale={{ duration: 200, start: 0.95 }}>
		<div class="flex items-center justify-between border-b border-secondary/30 px-6 py-4">
			<h2 class="text-xl font-bold text-text-main">{mode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
			<button class="rounded-full p-2 text-secondary hover:bg-secondary/20 hover:text-text-main" on:click={() => dispatch('close')}><X size={20} /></button>
		</div>

		<div class="flex border-b border-secondary/30 bg-surface-alt/50 px-2">
			{#each [{ id: 'basic', icon: Info, label: 'Basic Info' }, { id: 'pricing', icon: Tag, label: 'Pricing & Stock' }, { id: 'image', icon: ImageIcon, label: 'Image' }] as tab}
				<button class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors {activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-text-main'}" on:click={() => (activeTab = tab.id)} type="button">
					<svelte:component this={tab.icon} size={16} /> {tab.label}
				</button>
			{/each}
		</div>

		<form method="POST" action={mode === 'add' ? '?/addProduct' : '?/editProduct'} use:enhance class="p-6">
			{#if $message}<div class="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">{$message}</div>{/if}
			{#if mode === 'edit'}<input type="hidden" name="id" value={$form.id} />{/if}

			<div class={activeTab === 'basic' ? 'block' : 'hidden'}><div class="space-y-4">
				<div><label class="mb-1.5 block text-sm font-medium text-text-main">Title</label>
					<input name="title" type="text" class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary" placeholder="e.g. The Pragmatic Programmer" bind:value={$form.title} />
					{#if $errors.title}<span class="mt-1 text-xs text-danger">{$errors.title}</span>{/if}</div>
				<div><label class="mb-1.5 block text-sm font-medium text-text-main">Description</label>
					<textarea name="description" class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary" rows="4" placeholder="Enter product description..." bind:value={$form.description}></textarea>
					{#if $errors.description}<span class="mt-1 text-xs text-danger">{$errors.description}</span>{/if}</div>
			</div></div>

			<div class={activeTab === 'pricing' ? 'block' : 'hidden'}><div class="space-y-4">
				<div><label class="mb-1.5 block text-sm font-medium text-text-main">Price (IDR)</label>
					<input name="price" type="number" class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary" min="0" bind:value={$form.price} />
					{#if $errors.price}<span class="mt-1 text-xs text-danger">{$errors.price}</span>{/if}</div>
				<div><label class="mb-1.5 block text-sm font-medium text-text-main">Stock Quantity</label>
					<input name="quantity" type="number" class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary" min="0" bind:value={$form.quantity} />
					{#if $errors.quantity}<span class="mt-1 text-xs text-danger">{$errors.quantity}</span>{/if}</div>
			</div></div>

			<div class={activeTab === 'image' ? 'block' : 'hidden'}><div class="space-y-4">
				<label class="mb-1.5 block text-sm font-medium text-text-main">Product Image</label>
				<input type="hidden" name="image" bind:value={$form.image} />
				{#if $form.image}
					<div class="mb-4 flex flex-col items-center gap-3 rounded-lg border border-secondary/30 p-4">
						<img src={$form.image} alt="Preview" class="h-32 w-32 rounded-lg border border-secondary/50 object-cover shadow-sm" />
						<button type="button" class="text-sm font-medium text-danger hover:text-danger-hover" on:click={() => $form.image = ''}>Remove Image</button>
					</div>
				{/if}
				<label class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-secondary/50 bg-surface-alt/30 py-8 transition-all hover:border-primary hover:bg-primary/5">
					<ImageIcon size={32} class="mb-3 text-secondary" />
					<span class="text-sm font-medium text-text-main">Click to upload an image file</span>
					<span class="mt-1 text-xs text-secondary">SVG, PNG, JPG or GIF (max. 5MB)</span>
					<input type="file" class="hidden" accept="image/*" on:change={handleFileChange} />
				</label>
				{#if $errors.image}<span class="mt-1 text-xs text-danger">{$errors.image}</span>{/if}
			</div></div>

			<div class="mt-8 flex justify-end gap-3 border-t border-secondary/30 pt-6">
				<button type="button" class="rounded-lg border border-secondary/50 bg-surface px-6 py-2.5 text-sm font-medium text-text-main hover:bg-surface-alt" on:click={() => dispatch('close')}>Cancel</button>
				<button type="submit" class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-text-inverse hover:bg-primary-hover hover:shadow-lg">{mode === 'add' ? 'Create Product' : 'Save Changes'}</button>
			</div>
		</form>
	</div>
</div>
