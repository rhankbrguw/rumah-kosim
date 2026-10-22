<script lang="ts">
	import { page } from '$app/stores';
	import { resolveRoute } from '$app/paths';
	import { STRINGS } from '$lib/constants/strings';
	import { HTTP_STATUS } from '$lib/constants/config';
	import { CLIENT_ROUTES } from '$lib/constants/routes';
</script>

<svelte:head>
	<title
		>{$page.status === HTTP_STATUS.NOT_FOUND
			? STRINGS.META.ERROR_404
			: STRINGS.META.ERROR_500}</title
	>
</svelte:head>

<div class="flex h-screen w-full flex-col items-center justify-center bg-surface px-4 text-center">
	<h1 class="mb-4 text-6xl font-bold text-primary">{$page.status}</h1>
	<p class="mb-8 text-xl text-text-main">{$page.error?.message || STRINGS.COMMON.ERROR}</p>
	<a
		href={resolveRoute(CLIENT_ROUTES.SHOP)}
		class="rounded-lg bg-primary px-6 py-3 font-semibold text-text-inverse hover:bg-primary-hover"
	>
		{STRINGS.PRODUCT.BACK_TO_SHOP}
	</a>
</div>
