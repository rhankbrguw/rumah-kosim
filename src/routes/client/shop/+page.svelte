<script lang="ts">
	import Shop from '$lib/components/Shop.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Shop books={data.books} loading={false} />
