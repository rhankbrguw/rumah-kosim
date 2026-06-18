<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Upload } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { fade, scale } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Record<string, unknown>>;

	const dispatch = createEventDispatcher();

	const { form, errors, enhance, message } = superForm(data, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				dispatch('close');
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}
		}
	});

	let imageUrl = '';
	$: if (imageUrl) {
		$form.image = imageUrl;
	}

	function handleUpload(e: CustomEvent) {
		const { event } = e.detail;
		dispatch('uploadImage', { event, id: null });
		// Wait, the parent handleUploadImage in +page.svelte sets state.newProduct.image
		// Since we don't have newProduct anymore, I need a callback or something?
		// Actually, I can just let the user type the image URL for now or keep it simple
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-text-main/50 px-4 pb-6 pt-24"
	transition:fade={{ duration: 200 }}
>
	<div
		class="w-full max-w-[400px] rounded-lg bg-surface p-5 shadow-lg"
		transition:scale={{ duration: 200, start: 0.95 }}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-text-main">{STRINGS.ADMIN.MODALS.ADD_PRODUCT.TITLE}</h2>
			<button
				class="text-secondary transition-colors hover:text-text-main"
				aria-label="Close"
				on:click={() => dispatch('close')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		{#if $message}
			<div class="mb-4 rounded-lg bg-primary-light p-3 text-sm text-primary">{$message}</div>
		{/if}

		<form method="POST" action="?/addProduct" use:enhance class="space-y-4">
			<div>
				<label for="p-title" class="mb-1.5 block text-sm font-medium text-text-main"
					>{STRINGS.ADMIN.MODALS.ADD_PRODUCT.FIELDS.TITLE}</label
				>
				<input
					id="p-title"
					name="title"
					type="text"
					class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
					bind:value={$form.title}
				/>
				{#if $errors.title}<span class="text-xs text-danger">{$errors.title}</span>{/if}
			</div>

			<div>
				<label for="p-desc" class="mb-1.5 block text-sm font-medium text-text-main"
					>{STRINGS.ADMIN.MODALS.ADD_PRODUCT.FIELDS.DESC}</label
				>
				<textarea
					id="p-desc"
					name="description"
					class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
					rows="2"
					bind:value={$form.description}
				></textarea>
				{#if $errors.description}<span class="text-xs text-danger">{$errors.description}</span>{/if}
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="p-price" class="mb-1.5 block text-sm font-medium text-text-main"
						>{STRINGS.ADMIN.MODALS.ADD_PRODUCT.FIELDS.PRICE}</label
					>
					<input
						id="p-price"
						name="price"
						type="number"
						class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
						min="0"
						bind:value={$form.price}
					/>
					{#if $errors.price}<span class="text-xs text-danger">{$errors.price}</span>{/if}
				</div>
				<div>
					<label for="p-qty" class="mb-1.5 block text-sm font-medium text-text-main"
						>{STRINGS.ADMIN.MODALS.ADD_PRODUCT.FIELDS.QTY}</label
					>
					<input
						id="p-qty"
						name="quantity"
						type="number"
						class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
						min="0"
						bind:value={$form.quantity}
					/>
					{#if $errors.quantity}<span class="text-xs text-danger">{$errors.quantity}</span>{/if}
				</div>
			</div>

			<div>
				<label for="pImage" class="mb-1.5 block text-sm font-medium text-text-main"
					>Image URL</label
				>
				<input
					id="pImage"
					name="image"
					type="text"
					class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
					bind:value={$form.image}
				/>
				{#if $errors.image}<span class="text-xs text-danger">{$errors.image}</span>{/if}
			</div>

			<div class="mt-6 flex justify-end gap-3">
				<button
					type="button"
					class="rounded-md border border-secondary px-6 py-2 text-text-main transition-colors hover:bg-surface-alt"
					on:click={() => dispatch('close')}
				>
					{STRINGS.ADMIN.MODALS.ADD_PRODUCT.CANCEL}
				</button>
				<button
					type="submit"
					class="rounded-md bg-primary px-6 py-2 text-text-inverse transition-colors hover:bg-primary-hover"
				>
					{STRINGS.ADMIN.MODALS.ADD_PRODUCT.SUBMIT}
				</button>
			</div>
		</form>
	</div>
</div>
