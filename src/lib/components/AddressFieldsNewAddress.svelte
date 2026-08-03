<script lang="ts">
	import { slide } from 'svelte/transition';
	import { STRINGS } from '$lib/constants/strings';
	import { locationsData } from '$lib/constants/locations';

	export let form: Record<string, unknown> & {
		saveInfo: boolean;
		city: string;
		district: string;
		address: string;
		[key: string]: unknown;
	};
	export let districts: string[];
	export let subdistricts: string[];
	export let inputClass: string;
	export let selectClass: string;
</script>

<div
	transition:slide={{ duration: 300 }}
	class="space-y-4 rounded-xl border border-surface-alt bg-surface-alt/20 p-5 backdrop-blur-md"
>
	<h3 class="font-semibold text-text-main">{STRINGS.CHECKOUT.ADDRESS.NEW_DETAIL}</h3>
	<div class="grid grid-cols-2 gap-3 sm:gap-4">
		<input
			type="text"
			name="firstName"
			bind:value={form.firstName}
			placeholder={STRINGS.CHECKOUT.ADDRESS.FIRST_NAME}
			class={inputClass}
			required
		/>
		<input
			type="text"
			name="lastName"
			bind:value={form.lastName}
			placeholder={STRINGS.CHECKOUT.ADDRESS.LAST_NAME}
			class={inputClass}
			required
		/>
	</div>
	<input
		type="text"
		name="address"
		bind:value={form.address}
		placeholder={STRINGS.CHECKOUT.ADDRESS.ADDRESS}
		minlength="10"
		class={inputClass}
		required
	/>
	<input
		type="text"
		name="apartment"
		bind:value={form.apartment}
		placeholder={STRINGS.CHECKOUT.ADDRESS.APARTMENT}
		class={inputClass}
	/>

	<div class="grid grid-cols-2 gap-3 sm:gap-4">
		<select
			name="city"
			bind:value={form.city}
			on:change={() => {
				form.district = '';
				form.subdistrict = '';
			}}
			class={selectClass}
			required
		>
			<option value="">Select City</option>
			{#each Object.keys(locationsData) as cityName (cityName)}
				<option value={cityName}>{cityName}</option>
			{/each}
		</select>
		<select
			name="district"
			bind:value={form.district}
			on:change={() => (form.subdistrict = '')}
			class={selectClass}
			required
		>
			<option value="">Select District</option>
			{#each districts as districtName (districtName)}
				<option value={districtName}>{districtName}</option>
			{/each}
		</select>
	</div>

	<div class="grid grid-cols-2 gap-3 sm:gap-4">
		<select name="subdistrict" bind:value={form.subdistrict} class={selectClass} required>
			<option value="">Select Subdistrict</option>
			{#each subdistricts as subdistrictName (subdistrictName)}
				<option value={subdistrictName}>{subdistrictName}</option>
			{/each}
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
	<input type="hidden" name="province" bind:value={form.province} />

	<div class="mt-4 flex items-center gap-3">
		<input
			type="checkbox"
			id="saveInfo"
			name="saveInfo"
			bind:checked={form.saveInfo}
			class="h-5 w-5 rounded border-secondary/20 text-primary focus:ring-primary"
		/>
		<label for="saveInfo" class="text-sm font-medium text-text-main">
			{STRINGS.CHECKOUT.ADDRESS.SAVE_INFO}
		</label>
	</div>

	{#if form.saveInfo}
		<div transition:slide={{ duration: 250 }} class="mt-3">
			<input
				type="text"
				name="addressLabel"
				bind:value={form.addressLabel}
				placeholder={STRINGS.CHECKOUT.ADDRESS.LABEL_PLACEHOLDER}
				class={inputClass}
				required={!!form.saveInfo}
			/>
		</div>
	{/if}
</div>
