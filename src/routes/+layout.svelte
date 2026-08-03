<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/Header.svelte';
	import ChatWidget from '$lib/components/ChatWidget.svelte';
	import { ANIMATION } from '$lib/constants/config';
</script>

<Toaster
	position="top-center"
	duration={ANIMATION.TOAST_DURATION_MS}
	richColors
	toastOptions={{
		classes: {
			toast: 'bg-surface text-text-main rounded-xl border border-surface-alt shadow-lg font-sans'
		}
	}}
/>

<div
	class="fixed inset-0 -z-50 bg-[url('/images/bg-ruko.png')] bg-cover bg-center bg-no-repeat opacity-[0.05]"
></div>
<div class="app">
	<Header />
	<main>
		<slot />
		<ChatWidget />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		width: 100%;
	}
</style>
