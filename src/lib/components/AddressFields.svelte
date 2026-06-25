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

	let useNewAddress = userAddresses.length === 0;

	function selectAddress(addr: any) {
		useNewAddress = false;
		try {
			const parsed = JSON.parse(addr.address_text);
			Object.assign(form, parsed);
		} catch (e) {}
	}
</script>

{#if userAddresses.length > 0}
	<div class="mb-6 space-y-3">
		<h3 class="text-sm font-semibold text-text-main">{STRINGS.CHECKOUT.ADDRESS.SAVED_ADDRESS}</h3>
		<div class="grid gap-3 sm:grid-cols-2">
			{#each userAddresses as addr}
				<button
					type="button"
					on:click={() => selectAddress(addr)}
					class="relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all {(!useNewAddress && form.firstName && addr.address_text.includes(form.firstName)) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-surface-alt bg-surface-alt/50 hover:bg-surface-alt'}"
				>
					<div class="flex w-full items-center justify-between">
						<span class="font-bold text-text-main flex items-center gap-2">
							<MapPin size={16} class="text-primary" />
							{addr.label}
						</span>
						{#if addr.is_primary}
							<span class="rounded bg-primary px-2 py-0.5 text-xs font-bold text-secondary">{STRINGS.CHECKOUT.ADDRESS.MAIN}</span>
						{/if}
					</div>
					<span class="mt-2 line-clamp-2 text-xs text-text-muted">
						{(() => {
							try { return JSON.parse(addr.address_text).address; }
							catch { return addr.address_text; }
						})()}
					</span>
				</button>
			{/each}
			
			<button
				type="button"
				on:click={() => { useNewAddress = true; Object.keys(form).forEach(k => form[k] = (k === 'province' ? 'JABODETABEK' : '')); }}
				class="relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4 text-primary transition-all hover:bg-primary/10 {useNewAddress ? 'ring-2 ring-primary border-solid' : ''}"
			>
				<Plus size={20} />
				<span class="font-bold text-sm">{STRINGS.CHECKOUT.ADDRESS.USE_NEW}</span>
			</button>
		</div>
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
