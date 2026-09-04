<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import AddressFieldsNewAddress from './AddressFieldsNewAddress.svelte';

	export let form: Record<string, unknown> & {
		city: string;
		district: string;
		subdistrict: string;
		province: string;
		address: string;
		saveInfo: boolean;
		[key: string]: unknown;
	};
	export let userAddresses: { address_text: string; label: string; is_primary: boolean }[] = [];
	export let isLoading: boolean;

	const inputClass =
		'w-full rounded-xl border border-secondary/20 bg-surface-alt px-4 py-3 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary';
	const selectClass =
		'w-full rounded-xl border border-secondary/20 bg-surface-alt px-4 py-3 text-sm';

	let selectedAddressIndex = 'new';
	let useNewAddress = true;

	if (userAddresses.length > 0) {
		const idx = userAddresses.findIndex((addr) => {
			try {
				const parsed = JSON.parse(addr.address_text);
				return parsed.address && parsed.address === form.address;
			} catch {
				// Ignore JSON parse errors for user addresses
				return false;
			}
		});
		if (idx !== -1) {
			selectedAddressIndex = idx.toString();
			useNewAddress = false;
		} else if (form.address) {
			// Fallback allocation for unmatched addresses
			selectedAddressIndex = 'new';
			useNewAddress = true;
		} else {
			// Pre-select primary index 0
			selectedAddressIndex = '0';
			useNewAddress = false;
			try {
				form = { ...form, ...JSON.parse(userAddresses[0].address_text) };
			} catch {
				// Fallback to empty form if JSON parsing fails
				useNewAddress = true;
				selectedAddressIndex = 'new';
			}
		}
	}

	function selectAddress(addr: { address_text: string; [key: string]: unknown }) {
		useNewAddress = false;
		try {
			form = { ...form, ...JSON.parse(addr.address_text) };
		} catch {
			// Fallback to empty form if JSON parsing fails
			useNewAddress = true;
			selectedAddressIndex = 'new';
		}
	}
</script>

{#if userAddresses.length > 0}
	<div class="mb-6 space-y-1.5">
		<label for="checkout_saved_address" class="block text-sm font-semibold text-text-main"
			>{STRINGS.CHECKOUT.ADDRESS.SAVED_ADDRESS}</label
		>
		<select
			id="checkout_saved_address"
			bind:value={selectedAddressIndex}
			on:change={() => {
				if (selectedAddressIndex === 'new') {
					useNewAddress = true;
					Object.keys(form).forEach((k) => (form[k] = k === 'province' ? 'JABODETABEK' : ''));
				} else {
					useNewAddress = false;
					selectAddress(userAddresses[parseInt(selectedAddressIndex)]);
				}
			}}
			class={selectClass}
		>
			<option value="new">{STRINGS.CHECKOUT.ADDRESS.USE_NEW}</option>
			{#each userAddresses as addr, index (index)}
				<option value={index.toString()}
					>{addr.label}
					{#if addr.is_primary}({STRINGS.CHECKOUT.ADDRESS.MAIN}){/if}</option
				>
			{/each}
		</select>
	</div>
{/if}

{#if useNewAddress}
	<AddressFieldsNewAddress bind:form {inputClass} {selectClass} />
{/if}

<button
	type="submit"
	disabled={isLoading}
	class="mt-6 w-full rounded-xl bg-primary py-4 text-center font-bold text-secondary shadow-lg transition-transform hover:-translate-y-1 hover:bg-primary-hover active:translate-y-0 disabled:opacity-70"
>
	{isLoading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.ADDRESS.CONTINUE}
</button>

{#if !useNewAddress}
	<input type="hidden" name="firstName" value={form.firstName || ''} />
	<input type="hidden" name="lastName" value={form.lastName || ''} />
	<input type="hidden" name="address" value={form.address || ''} />
	<input type="hidden" name="apartment" value={form.apartment || ''} />
	<input type="hidden" name="city" value={form.city || ''} />
	<input type="hidden" name="district" value={form.district || ''} />
	<input type="hidden" name="subdistrict" value={form.subdistrict || ''} />
	<input type="hidden" name="postalCode" value={form.postalCode || ''} />
	<input type="hidden" name="province" value={form.province || 'JABODETABEK'} />
{/if}
