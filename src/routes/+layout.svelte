<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/Header.svelte';
</script>

<Toaster 
	position="top-center" 
	duration={3500}
	richColors 
	toastOptions={{
		style: 'border-radius: 12px; font-family: inherit; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid var(--color-surface-alt);'
	}}
/>

<div
	class="fixed inset-0 -z-50 bg-cover bg-center bg-no-repeat opacity-[0.05] bg-[url('/images/bg-ruko.png')]"
></div>
<div class="app">
	<Header />
	<main>
		<slot />
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
