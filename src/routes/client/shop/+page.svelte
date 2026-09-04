<script lang="ts">
	import { navigating } from '$app/stores';
	import Shop from '$lib/components/Shop.svelte';
	import { STRINGS } from '$lib/constants/strings';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.search ? `Search: "${data.search}"` : STRINGS.META.SHOP}</title>
</svelte:head>

<Shop
	books={data.books}
	total={data.total}
	currentPage={data.page}
	itemsPerPage={data.limit}
	searchTerm={data.search || ''}
	isLoading={Boolean($navigating)}
/>
