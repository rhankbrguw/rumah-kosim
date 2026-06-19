<script lang="ts">
	import AddressForm from '$lib/components/AddressForm.svelte';
	import { toast } from 'svelte-sonner';
	import { STRINGS } from '$lib/constants/strings';
	
	import type { PageData } from './$types';
	export let data: PageData;

	function handleSuccess() {
		toast.success(STRINGS.TOAST.ADDRESS_SUCCESS);
	}
</script>

<AddressForm data={data.form} cartItems={data.cartItems} onSubmitSuccess={handleSuccess} />
