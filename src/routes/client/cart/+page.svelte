<script lang="ts">
	import Cart from '$lib/components/Cart.svelte';
	import { STRINGS } from '$lib/constants/strings';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>{STRINGS.META.CART}</title>
</svelte:head>

<div class="min-h-screen bg-surface-alt py-8">
	<Cart cartItems={data.cartItems} />
</div>
