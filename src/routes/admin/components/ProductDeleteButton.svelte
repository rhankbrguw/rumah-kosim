<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { STRINGS } from '$lib/constants/strings.js';

	export let product: { id: number; title: string };

	let isDeleting = false;
	let deleteForm: HTMLFormElement;

	function submitDelete() {
		if (isDeleting) return;
		if (!window.confirm(`${STRINGS.ADMIN.CONFIRM_DELETE.PROMPT} ${product.title}`)) return;
		isDeleting = true;
		deleteForm?.requestSubmit();
	}
</script>

<button
	type="button"
	class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-danger text-text-inverse transition-colors hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
	title={STRINGS.ADMIN.PRODUCT_TABLE.DELETE_PRODUCT}
	aria-label={`${STRINGS.ADMIN.PRODUCT_TABLE.DELETE_PRODUCT}: ${product.title}`}
	on:click={submitDelete}
>
	<Trash2 size={15} />
</button>

<form bind:this={deleteForm} method="POST" action="?/deleteProduct" use:enhance class="hidden">
	<input type="hidden" name="id" value={product.id} />
</form>
