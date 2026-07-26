<script lang="ts">
	import Shop from '$lib/components/Shop.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Shop books={data.books} total={data.total} currentPage={data.page} itemsPerPage={data.limit} searchTerm={data.search || ''} loading={false} />
