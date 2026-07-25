<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
</script>

<div
	class="flex flex-col items-center justify-center rounded-2xl border border-secondary/10 bg-surface p-12 text-center shadow-sm"
>
	<p class="text-lg text-text-muted">{STRINGS.ORDER_HISTORY.EMPTY}</p>
	<a
		href="/client/shop"
		class="mt-6 rounded-xl bg-primary px-8 py-3 font-bold text-text-inverse transition-colors hover:bg-primary-hover"
	>
		{STRINGS.ORDER_HISTORY.START_SHOPPING}
	</a>
</div>
