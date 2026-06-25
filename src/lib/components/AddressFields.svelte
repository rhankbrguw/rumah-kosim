<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { locationsData } from '$lib/constants/locations';
	import { slide, fade } from 'svelte/transition';
	import { MapPin, Plus } from 'lucide-svelte';

	export let form: Record<string, any>;
	export let userAddresses: any[] = [];
	export let loading: boolean;

	$: districts = Object.keys((locationsData as Record<string, Record<string, string[]>>)[form.city] || {});
	$: subdistricts = (locationsData as Record<string, Record<string, string[]>>)[form.city]?.[form.district] || [];

	const inputClass = 'w-full rounded-xl border border-secondary/20 bg-surface-alt px-4 py-3 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary';
	const selectClass = 'w-full rounded-xl border border-secondary/20 bg-surface-alt px-4 py-3 text-sm';

	let selectedAddressIndex = 'new';
	let useNewAddress = true;

	if (userAddresses.length > 0) {
		const idx = userAddresses.findIndex(addr => {
			try {
				const parsed = JSON.parse(addr.address_text);
				return parsed.address && parsed.address === form.address;
			} catch { return false; }
		});
		if (idx !== -1) {
			selectedAddressIndex = idx.toString();
			useNewAddress = false;
		} else if (form.address) {
			// If form has address but not in saved list, it's a new address
			selectedAddressIndex = 'new';
			useNewAddress = true;
		} else {
			// Default to first saved address if available
			selectedAddressIndex = '0';
			useNewAddress = false;
			try {
				form = { ...form, ...JSON.parse(userAddresses[0].address_text) };
			} catch(e) {}
		}
	}

	function selectAddress(addr: any) {
		useNewAddress = false;
		try {
			form = { ...form, ...JSON.parse(addr.address_text) };
		} catch (e) {}
	}
</script>

{#if userAddresses.length > 0}
	<div class="mb-6 space-y-1.5">
		<label for="checkout_saved_address" class="block text-sm font-semibold text-text-main">{STRINGS.CHECKOUT.ADDRESS.SAVED_ADDRESS}</label>
		<select id="checkout_saved_address" bind:value={selectedAddressIndex} on:change={(e) => {
			if (selectedAddressIndex === 'new') {
				useNewAddress = true;
				Object.keys(form).forEach(k => form[k] = (k === 'province' ? 'JABODETABEK' : ''));
			} else {
				useNewAddress = false;
				selectAddress(userAddresses[parseInt(selectedAddressIndex)]);
			}
		}} class={selectClass}>
			<option value="new">{STRINGS.CHECKOUT.ADDRESS.USE_NEW}</option>
			{#each userAddresses as addr, index}
				<option value={index.toString()}>{addr.label} {#if addr.is_primary}({STRINGS.CHECKOUT.ADDRESS.MAIN}){/if}</option>
			{/each}
		</select>
	</div>
{/if}

{#if useNewAddress}
	<div transition:slide={{ duration: 300 }} class="space-y-4 rounded-xl border border-surface-alt bg-surface-alt/20 p-5 backdrop-blur-md">
		<h3 class="font-semibold text-text-main">{STRINGS.CHECKOUT.ADDRESS.NEW_DETAIL}</h3>
		<div class="grid grid-cols-2 gap-3 sm:gap-4">
			<input type="text" name="firstName" bind:value={form.firstName} placeholder={STRINGS.CHECKOUT.ADDRESS.FIRST_NAME} class={inputClass} required />
			<input type="text" name="lastName" bind:value={form.lastName} placeholder={STRINGS.CHECKOUT.ADDRESS.LAST_NAME} class={inputClass} required />
		</div>
		<input type="text" name="address" bind:value={form.address} placeholder={STRINGS.CHECKOUT.ADDRESS.ADDRESS} minlength="10" class={inputClass} required />
		<input type="text" name="apartment" bind:value={form.apartment} placeholder={STRINGS.CHECKOUT.ADDRESS.APARTMENT} class={inputClass} />

		<div class="grid grid-cols-2 gap-3 sm:gap-4">
			<select name="city" bind:value={form.city} on:change={() => { form.district = ''; form.subdistrict = ''; }} class={selectClass} required>
				<option value="">Select City</option>
				{#each Object.keys(locationsData) as c}<option value={c}>{c}</option>{/each}
			</select>
			<select name="district" bind:value={form.district} on:change={() => (form.subdistrict = '')} class={selectClass} required>
				<option value="">Select District</option>
				{#each districts as d}<option value={d}>{d}</option>{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:gap-4">
			<select name="subdistrict" bind:value={form.subdistrict} class={selectClass} required>
				<option value="">Select Subdistrict</option>
				{#each subdistricts as s}<option value={s}>{s}</option>{/each}
			</select>
			<input type="text" name="postalCode" bind:value={form.postalCode} placeholder={STRINGS.CHECKOUT.ADDRESS.POSTAL} minlength="5" maxlength="5" on:input={(e) => (form.postalCode = (e.target as HTMLInputElement).value.slice(0, 5).replace(/\D/g, ''))} class={inputClass} required />
		</div>
		<input type="hidden" name="province" bind:value={form.province} />

		<div class="mt-4 flex items-center gap-3">
			<input type="checkbox" id="saveInfo" name="saveInfo" bind:checked={form.saveInfo} class="h-5 w-5 rounded border-secondary/20 text-primary focus:ring-primary" />
			<label for="saveInfo" class="text-sm font-medium text-text-main">
				{STRINGS.CHECKOUT.ADDRESS.SAVE_INFO}
			</label>
		</div>

		{#if form.saveInfo}
			<div transition:slide={{ duration: 250 }} class="mt-3">
				<input type="text" name="addressLabel" bind:value={form.addressLabel} placeholder={STRINGS.CHECKOUT.ADDRESS.LABEL_PLACEHOLDER} class={inputClass} required={form.saveInfo} />
			</div>
		{/if}
	</div>
{/if}

<button type="submit" disabled={loading} class="mt-6 w-full rounded-xl bg-primary py-4 text-center font-bold text-secondary shadow-lg transition-transform hover:-translate-y-1 hover:bg-primary-hover active:translate-y-0 disabled:opacity-70">
	{loading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.ADDRESS.CONTINUE}
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
