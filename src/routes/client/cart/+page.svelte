<script lang="ts">
	import Cart from '$lib/components/Cart.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="min-h-screen bg-surface-alt py-8">
	<Cart cartItems={data.cartItems} />
</div>
