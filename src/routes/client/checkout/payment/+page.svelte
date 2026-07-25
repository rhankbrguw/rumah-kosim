<script lang="ts">
	import CheckoutPayment from '$lib/components/CheckoutPayment.svelte';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { CartItem } from '$lib/types';
	export let data: {
		paymentForm: SuperValidated<Record<string, unknown>>;
		cartItems: CartItem[];
	};
</script>

<CheckoutPayment data={data.paymentForm} cartItems={data.cartItems} />
