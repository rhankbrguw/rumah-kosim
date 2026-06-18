<script lang="ts">
	import AddressForm from '$lib/components/AddressForm.svelte';
	import { toast } from 'svelte-sonner';
	
	import type { PageData } from './$types';
	export let data: PageData;

	function handleSuccess() {
		toast.success('Address saved successfully');
	}
</script>

<AddressForm data={data.form} cartItems={data.cartItems} onSubmitSuccess={handleSuccess} />
