<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { STRINGS } from '$lib/constants/strings';
	import CheckoutSummary from './CheckoutSummary.svelte';
	import AddressFields from './AddressFields.svelte';
	import { superForm } from 'sveltekit-superforms';

	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number, quantity: number }[] = [];
	export let onSubmitSuccess: () => void;

	$: subtotal = cartItems.reduce((acc, i) => acc + Number(i.price) * Number(i.quantity), 0);
	$: total = subtotal + shippingCost;

	const { form, errors, enhance, message } = superForm(data, {
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				loading = true;
				try {
					checkoutStore.update(s => ({ ...s, items: cartItems, subtotal, shippingCost, total, address: $form.address as string }));
					onSubmitSuccess?.();
					goto('/client/checkout/shipping');
				} catch (err) {
					error = (err as Error).message;
				} finally {
					loading = false;
				}
			}
		}
	});

	let saveInfo = false,
		shippingCost = 0,
		loading = false,
		error = '';

</script>

<div class="min-h-screen bg-surface">
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-16 lg:py-10">
		<h1 class="mb-6 mt-16 text-xl font-semibold text-text-main sm:mb-8 sm:text-2xl">
			{STRINGS.CHECKOUT.ADDRESS.TITLE}
		</h1>
		<div class="flex flex-col gap-8 lg:flex-row">
			<div class="flex-1">
				{#if error || $message}<div class="mb-4 text-sm text-danger">{error || $message}</div>{/if}
				<form method="POST" use:enhance class="space-y-4 sm:space-y-6">
					<AddressFields bind:form={$form as Record<string, string>} saveInfo={saveInfo} {loading} />
				</form>
			</div>

			<CheckoutSummary {cartItems} {subtotal} {total} />
		</div>
	</main>
</div>
