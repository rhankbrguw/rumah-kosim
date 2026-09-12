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
	closeButton
	toastOptions={{
		classes: {
			toast:
				'group toast font-sans rounded-2xl border border-surface-alt bg-surface text-text-main shadow-xl text-xs sm:text-sm p-3.5 sm:p-4 gap-3',
			title: 'font-bold text-xs sm:text-sm text-text-main',
			description: 'text-text-muted text-micro sm:text-xs',
			actionButton: 'bg-primary text-secondary font-semibold text-xs rounded-lg px-3 py-1.5',
			cancelButton: 'bg-surface-alt text-text-muted text-xs rounded-lg px-3 py-1.5',
			closeButton:
				'bg-surface border border-surface-alt text-text-muted hover:text-text-main hover:bg-surface-alt transition-colors'
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
