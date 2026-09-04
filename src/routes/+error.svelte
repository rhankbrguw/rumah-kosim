<script lang="ts">
	import { page } from '$app/stores';
	import { STRINGS } from '$lib/constants/strings';
</script>

<svelte:head>
	<title>{$page.status === 404 ? STRINGS.META.ERROR_404 : STRINGS.META.ERROR_500}</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<div class="flex h-screen w-full flex-col items-center justify-center bg-surface px-4 text-center">
	<h1 class="mb-4 text-6xl font-bold text-primary">{$page.status}</h1>
	<p class="mb-8 text-xl text-text-main">{$page.error?.message || 'Something went wrong'}</p>
	<a
		href="/client/shop"
		class="rounded-lg bg-primary px-6 py-3 font-semibold text-text-inverse hover:bg-primary-hover"
	>
		Go Back to Shop
	</a>
</div>
