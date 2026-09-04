<script lang="ts">
	import { onMount } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import { getLocationOptions, type LocationOption } from '$lib/services/locationService.js';

	export let form: Record<string, unknown> & {
		province: string;
		city: string;
		district: string;
		subdistrict: string;
	};
	export let selectClass: string;

	let provinces: LocationOption[] = [];
	let regencies: LocationOption[] = [];
	let districts: LocationOption[] = [];
	let villages: LocationOption[] = [];
	let provinceCode = '';
	let regencyCode = '';
	let districtCode = '';
	let isLoading = true;
	let loadError = '';

	onMount(async () => {
		try {
			provinces = await getLocationOptions('provinces');
			const selectedProvince = provinces.find((option) => option.name === form.province);
			if (selectedProvince) await selectProvince(selectedProvince);
		} catch (error) {
			loadError =
				error instanceof Error ? error.message : STRINGS.CHECKOUT.ADDRESS.LOCATION_LOAD_ERROR;
		} finally {
			isLoading = false;
		}
	});

	async function selectProvince(option: LocationOption) {
		provinceCode = option.code;
		form.province = option.name;
		form.city = '';
		form.district = '';
		form.subdistrict = '';
		regencies = await getLocationOptions('regencies', provinceCode);
		districts = [];
		villages = [];
	}

	async function selectRegency(option: LocationOption) {
		regencyCode = option.code;
		form.city = option.name;
		form.district = '';
		form.subdistrict = '';
		districts = await getLocationOptions('districts', regencyCode);
		villages = [];
	}

	async function selectDistrict(option: LocationOption) {
		districtCode = option.code;
		form.district = option.name;
		form.subdistrict = '';
		villages = await getLocationOptions('villages', districtCode);
	}
</script>

{#if loadError}
	<p class="rounded-lg bg-danger-light p-3 text-xs text-danger" role="alert">{loadError}</p>
{/if}

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
	<select
		class={selectClass}
		disabled={isLoading}
		aria-label={STRINGS.CHECKOUT.ADDRESS.SELECT_PROVINCE}
		on:change={(event) => {
			const option = provinces.find((item) => item.code === (event.currentTarget as HTMLSelectElement).value);
			if (option) selectProvince(option);
		}}
	>
		<option value=""
			>{isLoading ? STRINGS.COMMON.LOADING : STRINGS.CHECKOUT.ADDRESS.SELECT_PROVINCE}</option
		>
		{#each provinces as option (option.code)}
			<option value={option.code} selected={option.code === provinceCode}>{option.name}</option>
		{/each}
	</select>
	<select
		class={selectClass}
		disabled={!provinceCode || regencies.length === 0}
		aria-label={STRINGS.CHECKOUT.ADDRESS.SELECT_REGENCY}
		on:change={(event) => {
			const option = regencies.find((item) => item.code === (event.currentTarget as HTMLSelectElement).value);
			if (option) selectRegency(option);
		}}
	>
		<option value="">{STRINGS.CHECKOUT.ADDRESS.SELECT_REGENCY}</option>
		{#each regencies as option (option.code)}
			<option value={option.code} selected={option.code === regencyCode}>{option.name}</option>
		{/each}
	</select>
</div>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
	<select
		class={selectClass}
		disabled={!regencyCode || districts.length === 0}
		aria-label={STRINGS.CHECKOUT.ADDRESS.SELECT_DISTRICT}
		on:change={(event) => {
			const option = districts.find((item) => item.code === (event.currentTarget as HTMLSelectElement).value);
			if (option) selectDistrict(option);
		}}
	>
		<option value="">{STRINGS.CHECKOUT.ADDRESS.SELECT_DISTRICT}</option>
		{#each districts as option (option.code)}
			<option value={option.code} selected={option.code === districtCode}>{option.name}</option>
		{/each}
	</select>
	<select
		name="subdistrict"
		class={selectClass}
		disabled={!districtCode || villages.length === 0}
		aria-label={STRINGS.CHECKOUT.ADDRESS.SELECT_VILLAGE}
		bind:value={form.subdistrict}
		required
	>
		<option value="">{STRINGS.CHECKOUT.ADDRESS.SELECT_VILLAGE}</option>
		{#each villages as option (option.code)}
			<option value={option.name}>{option.name}</option>
		{/each}
	</select>
</div>

<input type="hidden" name="province" bind:value={form.province} />
<input type="hidden" name="city" bind:value={form.city} />
<input type="hidden" name="district" bind:value={form.district} />
