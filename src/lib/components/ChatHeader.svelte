<script lang="ts">
	import { Bot, X } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';

	export let toggleChat: () => void;
</script>

<div class="flex items-center justify-between border-b border-surface-alt bg-primary/10 px-5 py-4">
	<div class="flex items-center gap-3">
		<div
			class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary shadow-sm"
		>
			<Bot size={20} />
		</div>
		<div>
			<h3 class="font-bold text-text-main">{STRINGS.AI_CS.TITLE}</h3>
			<p class="text-xs text-text-muted">{STRINGS.AI_CS.SUBTITLE}</p>
		</div>
	</div>
	<button
		on:click={toggleChat}
		class="cursor-pointer rounded-full p-2 text-text-muted transition-colors duration-200 hover:bg-surface-alt hover:text-text-main"
	>
		<X size={20} />
	</button>
</div>
