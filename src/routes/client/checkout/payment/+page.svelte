<script lang="ts">
	import CheckoutPayment from '$lib/components/CheckoutPayment.svelte';
	import { STRINGS } from '$lib/constants/strings';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { CartItem } from '$lib/types';
	export let data: {
		paymentForm: SuperValidated<Record<string, unknown>>;
		cartItems: CartItem[];
	};
</script>

<svelte:head>
	<title>{STRINGS.META.CHECKOUT_PAYMENT}</title>
</svelte:head>

<CheckoutPayment data={data.paymentForm} cartItems={data.cartItems} />
