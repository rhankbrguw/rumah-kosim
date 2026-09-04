<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import { STRINGS } from '$lib/constants/strings';
</script>

<svelte:head>
	<title>{STRINGS.META.HOME}</title>
</svelte:head>

<Hero />
