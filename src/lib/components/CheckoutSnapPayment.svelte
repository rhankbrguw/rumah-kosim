<script lang="ts">
	import { PUBLIC_MIDTRANS_CLIENT_KEY } from '$env/static/public';
	import { env } from '$env/dynamic/public';
	import { createEventDispatcher } from 'svelte';
	import { EXTERNAL_ROUTES } from '$lib/constants/routes.js';

	export let snapToken = '';
	const dispatch = createEventDispatcher();
	let launchedToken = '';

	const snapUrl =
		env.PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
			? EXTERNAL_ROUTES.MIDTRANS_SNAP_PRODUCTION
			: EXTERNAL_ROUTES.MIDTRANS_SNAP_SANDBOX;

	$: if (snapToken && snapToken !== launchedToken) {
		launchedToken = snapToken;
		launchPayment(snapToken);
	}

	async function launchPayment(token: string) {
		const { handleMidtransPayment } = await import('$lib/services/paymentService.js');
		handleMidtransPayment(token, {
			onStart: () => dispatch('start'),
			onSuccess: (result) => dispatch('success', result),
			onPending: (result) => dispatch('pending', result),
			onError: (result) => dispatch('error', result),
			onClose: () => dispatch('close')
		});
	}
</script>

<svelte:head>
	<script src={snapUrl} data-client-key={PUBLIC_MIDTRANS_CLIENT_KEY}></script>
</svelte:head>
