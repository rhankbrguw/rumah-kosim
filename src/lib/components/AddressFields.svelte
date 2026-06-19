<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { locationsData } from '$lib/constants/locations';

	export let form: Record<string, string>;
	export let saveInfo: boolean;
	export let loading: boolean;

	$: districts = Object.keys((locationsData as Record<string, Record<string, string[]>>)[form.city] || {});
	$: subdistricts = (locationsData as Record<string, Record<string, string[]>>)[form.city]?.[form.district] || [];

	const inputClass = 'w-full rounded-xl border border-secondary/20 bg-surface-alt px-4 py-3 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary';
	const selectClass = 'w-full rounded-xl border border-secondary/20 bg-surface-alt px-4 py-3 text-sm';
</script>

<div class="grid grid-cols-2 gap-3 sm:gap-4">
	<input type="text" name="firstName" bind:value={form.firstName} placeholder={STRINGS.CHECKOUT.ADDRESS.FIRST_NAME} class={inputClass} required />
	<input type="text" name="lastName" bind:value={form.lastName} placeholder={STRINGS.CHECKOUT.ADDRESS.LAST_NAME} class={inputClass} required />
</div>
<input type="text" name="address" bind:value={form.address} placeholder={STRINGS.CHECKOUT.ADDRESS.ADDRESS} minlength="10" class={inputClass} required />
<input type="text" name="apartment" bind:value={form.apartment} placeholder={STRINGS.CHECKOUT.ADDRESS.APARTMENT} class={inputClass} />

<div class="grid grid-cols-2 gap-3 sm:gap-4">
	<select
		name="city"
		bind:value={form.city}
		on:change={() => { form.district = ''; form.subdistrict = ''; }}
		class={selectClass}
		required
	>
		<option value="">Select City</option>
		{#each Object.keys(locationsData) as c}<option value={c}>{c}</option>{/each}
	</select>
	<select
		name="district"
		bind:value={form.district}
		on:change={() => (form.subdistrict = '')}
		class={selectClass}
		required
	>
		<option value="">Select District</option>
		{#each districts as d}<option value={d}>{d}</option>{/each}
	</select>
</div>

<div class="grid grid-cols-2 gap-3 sm:gap-4">
	<select name="subdistrict" bind:value={form.subdistrict} class={selectClass} required>
		<option value="">Select Subdistrict</option>
		{#each subdistricts as s}<option value={s}>{s}</option>{/each}
	</select>
	<input
		type="text"
		name="postalCode"
		bind:value={form.postalCode}
		placeholder={STRINGS.CHECKOUT.ADDRESS.POSTAL}
		minlength="5"
		maxlength="5"
		on:input={(e) => (form.postalCode = (e.target as HTMLInputElement).value.slice(0, 5).replace(/\D/g, ''))}
		class={inputClass}
		required
	/>
</div>

<label class="flex items-center gap-2 py-1">
	<input type="checkbox" name="saveInfo" bind:checked={saveInfo} value="true" class="rounded border-secondary/20 text-primary focus:ring-primary" />
	<span class="text-sm text-text-muted">Save this information</span>
</label>

<button
	type="submit"
	disabled={loading}
	class="w-full rounded-xl bg-primary py-3 font-bold text-text-inverse transition-colors hover:bg-primary-hover disabled:opacity-50"
>
	{loading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.ADDRESS.CONTINUE}
</button>
