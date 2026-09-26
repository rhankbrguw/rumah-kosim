<script lang="ts">
	import AddressForm from '$lib/components/AddressForm.svelte';
	import { toast } from 'svelte-sonner';
	import { STRINGS } from '$lib/constants/strings';

	import type { PageData } from './$types';
	export let data: PageData;

	function handleSuccess(saved: boolean) {
		if (saved) {
			toast.success(STRINGS.TOAST.ADDRESS_SUCCESS);
		}
	}
</script>

<svelte:head>
	<title>{STRINGS.META.CHECKOUT_ADDRESS}</title>
</svelte:head>

<AddressForm
	data={data.form}
	cartItems={data.cartItems}
	userAddresses={data.userAddresses}
	onSubmitSuccess={handleSuccess}
/>
