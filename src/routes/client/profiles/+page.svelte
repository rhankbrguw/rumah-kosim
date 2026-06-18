<script lang="ts">
	import OrderHistory from '$lib/components/OrderHistory.svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<div class="container mx-auto mt-20 px-4 py-6">
	<OrderHistory data={data} />
</div>
