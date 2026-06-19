<script lang="ts">
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { STRINGS } from '$lib/constants/strings';
	import CheckoutSummary from './CheckoutSummary.svelte';
	import CheckoutProgressBar from './CheckoutProgressBar.svelte';
	import AddressFields from './AddressFields.svelte';
	import { superForm } from 'sveltekit-superforms';

	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number, quantity: number }[] = [];
	export let onSubmitSuccess: (saved: boolean) => void;

	$: subtotal = cartItems.reduce((acc, i) => acc + Number(i.price) * Number(i.quantity), 0);
	$: total = subtotal + shippingCost;

	const { form, errors, enhance, message } = superForm(data, {
		onResult: async ({ result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				loading = true;
				try {
					checkoutStore.update(s => ({ ...s, items: cartItems, subtotal, shippingCost, total, address: $form.address as string }));
					onSubmitSuccess?.(saveInfo);
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

<div class="min-h-screen w-full bg-surface pb-20 pt-24 md:pt-32">
	<div class="mx-auto max-w-5xl px-4 sm:px-8">
	<h1 class="mb-6 text-xl font-semibold text-text-main sm:text-2xl">
		{STRINGS.CHECKOUT.TITLE}
	</h1>

	<CheckoutProgressBar activeStep={0} />

	<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr,26rem] lg:gap-16">
		<div class="flex flex-col">
			{#if error || $message}
				<div class="mb-4 rounded-xl bg-danger-light p-3 text-sm text-danger">{error || $message}</div>
			{/if}
			<div class="pt-2">
				<form method="POST" use:enhance class="space-y-4 sm:space-y-5">
					<AddressFields bind:form={$form as Record<string, string>} saveInfo={saveInfo} {loading} />
				</form>
			</div>
		</div>

		<CheckoutSummary {cartItems} {subtotal} {total} />
	</div>
	</div>
</div>
