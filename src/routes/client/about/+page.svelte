<script lang="ts">
	import About from '$lib/components/About.svelte';
	import { STRINGS } from '$lib/constants/strings';
</script>

<svelte:head>
	<title>{STRINGS.META.ABOUT}</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-4 py-20">
	<div class="mx-auto w-full max-w-7xl">
		<About />
	</div>
</main>
