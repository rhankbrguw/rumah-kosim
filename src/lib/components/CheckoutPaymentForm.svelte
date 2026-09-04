<script lang="ts">
	import { checkoutStore } from '$lib/stores/checkoutStore';
	import { STRINGS } from '$lib/constants/strings';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { createEventDispatcher } from 'svelte';
	import CheckoutSecurityBanner from './CheckoutSecurityBanner.svelte';
	import CheckoutPaymentSubmitButton from './CheckoutPaymentSubmitButton.svelte';

	export let data: SuperValidated<Record<string, unknown>>;
	export let cartItems: { price: number; quantity: number; title?: string; image?: string }[] = [];
	export let total = 0;
	export let shippingCost = 0;
	export let isLoading = false;
	const dispatch = createEventDispatcher();

	function getShippingMethod() {
		const shipping = $checkoutStore.shipping;
		if (!shipping) return '';
		return (
			[shipping.label, shipping.method, shipping.id].find(
				(value): value is string => typeof value === 'string'
			) || ''
		);
	}

	const { form, enhance } = superForm(data, {
		onSubmit: ({ formData, cancel }) => {
			isLoading = true;
			if (!$checkoutStore.address) {
				isLoading = false;
				toast.error(STRINGS.VALIDATION.ADDRESS_REQUIRED);
				cancel();
				return;
			}
			formData.set('cartItemsJson', JSON.stringify(cartItems));
			formData.set('total', total.toString());
			formData.set('shippingAddress', $checkoutStore.address);
			formData.set('shippingPrice', shippingCost.toString());
			const shippingMethod = getShippingMethod();
			if (!shippingMethod) {
				isLoading = false;
				toast.error(STRINGS.CHECKOUT.SHIPPING.METHOD_REQUIRED);
				cancel();
				return;
			}
			formData.set('shippingMethod', shippingMethod);
		},
		onResult: ({ result }) => {
			if (result.type === 'success' && result.data?.form?.message?.snapToken) {
				dispatch('paymentReady', result.data.form.message.snapToken);
				return;
			}
			isLoading = false;
			const response = result as { data?: { form?: { message?: string | { text?: string } } } };
			const message = response.data?.form?.message;
			toast.error(typeof message === 'string' ? message : message?.text || STRINGS.COMMON.ERROR);
		}
	});
</script>

<form method="POST" use:enhance class="space-y-4 sm:space-y-5">
	<input type="hidden" name="cartItemsJson" value={$form.cartItemsJson} />
	<input type="hidden" name="total" value={$form.total} />
	<input type="hidden" name="shippingAddress" value={$form.shippingAddress} />
	<input type="hidden" name="shippingPrice" value={$form.shippingPrice} />
	<input type="hidden" name="shippingMethod" value={$form.shippingMethod} />
	<CheckoutSecurityBanner />
	<CheckoutPaymentSubmitButton {isLoading} />
</form>
