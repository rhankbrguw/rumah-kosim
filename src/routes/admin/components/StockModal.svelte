<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { fade, scale } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Record<string, unknown>>;
	export let editingProduct: { id: number, title: string, quantity: number } | null = null;

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

	$: if (editingProduct && editingProduct.quantity !== $form.quantity) {
		$form.id = editingProduct.id;
		$form.quantity = editingProduct.quantity;
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-text-main/50 px-4"
	transition:fade={{ duration: 200 }}
>
	<div
		class="w-full max-w-[400px] rounded-lg bg-surface p-6 shadow-lg"
		transition:scale={{ duration: 200, start: 0.95 }}
	>
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-text-main">
				{STRINGS.ADMIN.MODALS.UPDATE_STOCK.TITLE}
			</h2>
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

		<form method="POST" action="?/updateStock" use:enhance class="space-y-4">
			<input type="hidden" name="id" value={$form.id} />
			<div>
				<label for="s-qty" class="mb-1.5 block text-sm font-medium text-text-main"
					>{STRINGS.ADMIN.MODALS.UPDATE_STOCK.CURRENT}</label
				>
				<p class="mb-4 text-sm text-secondary">Current quantity: {editingProduct?.quantity}</p>
				<input
					id="s-qty"
					name="quantity"
					type="number"
					bind:value={$form.quantity}
					class="w-full rounded-md border border-secondary px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary"
					min="0"
				/>
				{#if $errors.quantity}<span class="text-xs text-danger">{$errors.quantity}</span>{/if}
			</div>

			<div class="mt-6 flex justify-end gap-3">
				<button
					type="button"
					class="rounded-md border border-secondary px-6 py-2 text-text-main transition-colors hover:bg-surface-alt"
					on:click={() => dispatch('close')}
				>
					{STRINGS.ADMIN.MODALS.UPDATE_STOCK.CANCEL}
				</button>
				<button
					type="submit"
					class="rounded-md bg-primary px-6 py-2 text-text-inverse transition-colors hover:bg-primary-hover"
				>
					{STRINGS.ADMIN.MODALS.UPDATE_STOCK.SUBMIT}
				</button>
			</div>
		</form>
	</div>
</div>
