<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings.js';
</script>

<div
	class="flex flex-col items-center justify-center rounded-2xl border border-surface-alt bg-surface p-10 text-center shadow-sm sm:p-14"
>
	<div
		class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
	>
		<BookOpen size={28} />
	</div>
	<p class="text-sm font-semibold text-text-main sm:text-base">{STRINGS.ORDER_HISTORY.EMPTY}</p>
	<a
		href="/client/shop"
		class="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-text-inverse shadow-sm transition-all hover:bg-primary-hover hover:shadow active:scale-95 sm:text-sm"
	>
		{STRINGS.ORDER_HISTORY.START_SHOPPING}
	</a>
</div>
