<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/Header.svelte';
</script>

<Toaster position="top-right" richColors />

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
