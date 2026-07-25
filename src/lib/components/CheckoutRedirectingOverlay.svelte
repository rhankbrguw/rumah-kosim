<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
</script>

<div
	class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm transition-all duration-300"
>
	<div
		class="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"
	></div>
	<h2 class="mt-6 text-2xl font-bold text-text-main">
		{STRINGS.CHECKOUT.PAYMENT.REDIRECT_SUCCESS}
	</h2>
	<p class="mt-2 text-text-muted">{STRINGS.CHECKOUT.PAYMENT.REDIRECT_DESC}</p>
</div>
