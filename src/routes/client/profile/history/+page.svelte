<script lang="ts">
	import OrderHistory from '$lib/components/OrderHistory.svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<div>
	<OrderHistory data={data} />
</div>
