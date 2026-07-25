<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	export let loading: boolean = false;
</script>

<button
	type="submit"
	disabled={loading}
	class="group relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary py-4 font-bold text-secondary shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 active:translate-y-0 disabled:opacity-70"
>
	<div
		class="absolute inset-0 translate-y-[100%] bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 group-hover:translate-y-0"
	></div>
	{#if loading}
		<div
			class="relative z-10 h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent"
		></div>
		<span class="relative z-10">{STRINGS.COMMON.LOADING}</span>
	{:else}
		<span class="relative z-10">{STRINGS.CHECKOUT.PAYMENT.PAY}</span>
		<div
			class="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 transition-transform group-hover:translate-x-1"
		>
			&rarr;
		</div>
	{/if}
</button>
