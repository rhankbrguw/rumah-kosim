<script lang="ts">
	import { Image as ImageIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';

	export let image: string;
	export let error: string[] | undefined;

	const dispatch = createEventDispatcher();

	function handleFileChange(e: Event) {
		dispatch('uploadImage', {
			event: e,
			onSuccess: (path: string) => {
				image = path;
			}
		});
	}
</script>

<div>
	<div class="space-y-3 sm:space-y-4">
		<label
			for="imageUpload"
			class="mb-1 block text-xs font-medium text-text-main sm:mb-1.5 sm:text-sm"
			>{STRINGS.ADMIN.MODALS.ADD_PRODUCT.FIELDS.IMAGE}</label
		>
		<input id="imageUpload" type="hidden" name="image" bind:value={image} />
		{#if image}
			<div
				class="mb-3 flex flex-col items-center gap-2 rounded-lg border border-secondary/30 p-3 sm:mb-4 sm:gap-3 sm:p-4"
			>
				<img
					src={image}
					alt={STRINGS.ADMIN.MODALS.ADD_PRODUCT.FIELDS.IMAGE}
					class="h-20 w-20 rounded-lg border border-secondary/50 object-cover shadow-sm sm:h-28 sm:w-28"
				/>
				<button
					type="button"
					class="text-xs font-medium text-danger hover:text-danger-hover sm:text-sm"
					on:click={() => (image = '')}>{STRINGS.ADMIN.MODALS.IMAGE.REMOVE}</button
				>
			</div>
		{/if}
		<label
			class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-secondary/50 bg-surface-alt/30 py-4 transition-all hover:border-primary hover:bg-primary/5 sm:py-6"
		>
			<ImageIcon size={24} class="mb-2 text-secondary sm:mb-3" />
			<span class="text-xs font-medium text-text-main sm:text-sm"
				>{STRINGS.ADMIN.MODALS.IMAGE.UPLOAD_HINT}</span
			>
			<span class="text-micro mt-1 text-secondary sm:text-xs"
				>{STRINGS.ADMIN.MODALS.IMAGE.FORMAT_HINT}</span
			>
			<input type="file" class="hidden" accept="image/*" on:change={handleFileChange} />
		</label>
		{#if error}<span class="mt-1 text-xs text-danger">{error}</span>{/if}
	</div>
</div>
