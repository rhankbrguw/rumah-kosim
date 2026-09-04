<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/Header.svelte';
	import ChatWidget from '$lib/components/ChatWidget.svelte';
	import { ANIMATION } from '$lib/constants/config';
	import { STRINGS } from '$lib/constants/strings';
</script>

<svelte:head>
	<title>{STRINGS.META.DEFAULT_TITLE}</title>
</svelte:head>

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

<div class="app-background fixed inset-0 -z-50"></div>
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
