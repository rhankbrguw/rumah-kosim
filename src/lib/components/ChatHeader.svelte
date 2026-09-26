<script lang="ts">
	import { Bot, X } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';

	export let toggleChat: () => void;
</script>

<div
	class="flex shrink-0 items-center justify-between border-b border-surface-alt bg-primary/10 px-3.5 py-2.5 sm:px-4 sm:py-3"
>
	<div class="flex items-center gap-2.5">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-secondary shadow-sm sm:h-9 sm:w-9"
		>
			<Bot size={18} />
		</div>
		<div>
			<h3 class="text-xs font-bold leading-tight text-text-main sm:text-sm">
				{STRINGS.AI_CS.TITLE}
			</h3>
			<p class="text-micro mt-0.5 text-text-muted sm:text-xs">{STRINGS.AI_CS.SUBTITLE}</p>
		</div>
	</div>
	<button
		on:click={toggleChat}
		class="cursor-pointer rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-main"
		title="Close Chat"
	>
		<X size={18} />
	</button>
</div>
