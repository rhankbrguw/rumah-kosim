<script lang="ts">
	import OrderHistory from '$lib/components/OrderHistory.svelte';
	import { STRINGS } from '$lib/constants/strings';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{STRINGS.META.ORDER_HISTORY}</title>
</svelte:head>

<div>
	<OrderHistory {data} />
</div>
