<script lang="ts">
	import { Image as ImageIcon } from 'lucide-svelte';
	export let image: string;

	export let errors: Record<string, string[] | undefined>;
	export let activeTab: string;
	export let handleFileChange: (e: Event) => void;
</script>

<div class={activeTab === 'image' ? 'block' : 'hidden'}>
	<div class="space-y-4">
		<span class="mb-1.5 block text-sm font-medium text-text-main">Product Image</span>
		<input type="hidden" name="image" bind:value={image} />
		{#if image}
			<div class="mb-4 flex flex-col items-center gap-3 rounded-lg border border-secondary/30 p-4">
				<img
					src={image}
					alt="Preview"
					class="h-32 w-32 rounded-lg border border-secondary/50 object-cover shadow-sm"
				/>
				<button
					type="button"
					class="text-sm font-medium text-danger hover:text-danger-hover"
					on:click={() => (image = '')}>Remove Image</button
				>
			</div>
		{/if}
		<label
			class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-secondary/50 bg-surface-alt/30 py-8 transition-all hover:border-primary hover:bg-primary/5"
		>
			<ImageIcon size={32} class="mb-3 text-secondary" />
			<span class="text-sm font-medium text-text-main">Click to upload an image file</span>
			<span class="mt-1 text-xs text-secondary">SVG, PNG, JPG or GIF (max. 5MB)</span>
			<input type="file" class="hidden" accept="image/*" on:change={handleFileChange} />
		</label>
		{#if errors?.image}<span class="mt-1 text-xs text-danger">{errors?.image}</span>{/if}
	</div>
</div>
