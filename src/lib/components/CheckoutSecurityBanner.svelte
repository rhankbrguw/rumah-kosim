<script lang="ts">
	import { Lock } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';
</script>

<div
	class="hover:shadow-glow-primary group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-surface-alt/40 to-surface/40 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-primary/40"
>
	<div
		class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-transform duration-500 group-hover:scale-150"
	></div>
	<div
		class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/10 blur-3xl transition-transform duration-500 group-hover:scale-150"
	></div>

	<div
		class="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/30"
	>
		<Lock size={28} class="text-secondary" />
	</div>

	<h3 class="mb-2 text-lg font-bold text-text-main">
		{STRINGS.CHECKOUT.PAYMENT.SECURE_GATEWAY_TITLE}
	</h3>
	<p class="mb-6 text-sm leading-relaxed text-text-muted">
		{STRINGS.CHECKOUT.PAYMENT.SECURE_GATEWAY_DESC}
	</p>

	<div
		class="relative z-10 flex items-center justify-center gap-3 rounded-xl bg-surface/50 py-3 backdrop-blur-md"
	>
		<span class="font-bold text-primary">Powered by Midtrans</span>
		<div class="bg-border-color h-4 w-px"></div>
		<span class="text-xs font-semibold uppercase tracking-wider text-text-main"
			>Global Security Standard</span
		>
	</div>
</div>
