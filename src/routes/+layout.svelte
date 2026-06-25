<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/Header.svelte';
	import ChatWidget from '$lib/components/ChatWidget.svelte';
</script>

<Toaster 
	position="top-center" 
	duration={3500}
	richColors 
	toastOptions={{ 
		style: 'border-radius: 12px; font-family: inherit; box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1)); border: 1px solid var(--color-surface-alt);',
		classes: { toast: 'bg-surface text-text-main' }
	}} 
/>

<div
	class="fixed inset-0 -z-50 bg-cover bg-center bg-no-repeat opacity-[0.05] bg-[url('/images/bg-ruko.png')]"
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
