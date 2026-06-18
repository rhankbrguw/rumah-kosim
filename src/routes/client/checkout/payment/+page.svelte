<script lang="ts">
	import CheckoutPayment from '$lib/components/CheckoutPayment.svelte';

	export let data: any;
</script>

<CheckoutPayment data={data.paymentForm} cartItems={data.cartItems} />
