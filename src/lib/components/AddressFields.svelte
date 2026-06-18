<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { locationsData } from '$lib/constants/locations';

	export let form: Record<string, string>;
	export let saveInfo: boolean;
	export let loading: boolean;

	$: districts = Object.keys((locationsData as Record<string, Record<string, string[]>>)[form.city] || {});
	$: subdistricts = (locationsData as Record<string, Record<string, string[]>>)[form.city]?.[form.district] || [];
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
	<input
		type="text"
		bind:value={form.firstName}
		placeholder={STRINGS.CHECKOUT.ADDRESS.FIRST_NAME}
		class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
		required
	/>
	<input
		type="text"
		bind:value={form.lastName}
		placeholder={STRINGS.CHECKOUT.ADDRESS.LAST_NAME}
		class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
		required
	/>
</div>
<input
	type="text"
	bind:value={form.address}
	placeholder={STRINGS.CHECKOUT.ADDRESS.ADDRESS}
	class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
	required
/>
<input
	type="text"
	bind:value={form.apartment}
	placeholder={STRINGS.CHECKOUT.ADDRESS.APARTMENT}
	class="w-full rounded-md border border-secondary px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
/>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
	<select
		bind:value={form.city}
		on:change={() => {
			form.district = '';
			form.subdistrict = '';
		}}
		class="w-full rounded-md border border-secondary px-3 py-2"
		required
	>
		<option value="">Select City</option>
		{#each Object.keys(locationsData) as c}<option value={c}>{c}</option>{/each}
	</select>
	<select
		bind:value={form.district}
		on:change={() => (form.subdistrict = '')}
		class="w-full rounded-md border border-secondary px-3 py-2"
		required
	>
		<option value="">Select District</option>
		{#each districts as d}<option value={d}>{d}</option>{/each}
	</select>
</div>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
	<select
		bind:value={form.subdistrict}
		class="w-full rounded-md border border-secondary px-3 py-2"
		required
	>
		<option value="">Select Subdistrict</option>
		{#each subdistricts as s}<option value={s}>{s}</option>{/each}
	</select>
	<input
		type="text"
		bind:value={form.postalCode}
		placeholder={STRINGS.CHECKOUT.ADDRESS.POSTAL}
		on:input={(e) => (form.postalCode = (e.target as HTMLInputElement).value.slice(0, 5))}
		class="w-full rounded-md border border-secondary px-3 py-2"
		required
	/>
</div>

<label class="flex items-center gap-2 py-2">
	<input type="checkbox" bind:checked={saveInfo} class="rounded border-secondary" />
	<span class="text-sm text-text-muted">Save this information</span>
</label>

<button
	type="submit"
	disabled={loading}
	class="mt-4 w-full rounded-md bg-primary py-3 text-text-inverse transition-colors hover:bg-primary-hover disabled:opacity-50"
>
	{loading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.ADDRESS.CONTINUE}
</button>
