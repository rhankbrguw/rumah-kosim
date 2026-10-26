<script lang="ts">
	export let activeTab: string;
	export let title: string;
	export let description: string;
	export let errors: { title?: string[]; description?: string[] };
</script>

<div class={activeTab === 'basic' ? 'block' : 'hidden'}>
	<div class="space-y-4">
		<div>
			<label for="title" class="mb-1.5 block text-sm font-medium text-text-main">Title</label>
			<input
				id="title"
				name="title"
				type="text"
				class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary"
				placeholder="e.g. The Pragmatic Programmer"
				bind:value={title}
			/>
			{#if errors?.title}<span class="mt-1 text-xs text-danger">{errors?.title}</span>{/if}
		</div>
		<div>
			<label for="description" class="mb-1.5 block text-sm font-medium text-text-main"
				>Description</label
			>
			<textarea
				id="description"
				name="description"
				class="w-full rounded-lg border border-secondary/50 bg-surface/50 px-4 py-2.5 focus:border-primary"
				rows="4"
				placeholder="Enter product description..."
				bind:value={description}
			></textarea>
			{#if errors?.description}<span class="mt-1 text-xs text-danger">{errors?.description}</span
				>{/if}
		</div>
	</div>
</div>
