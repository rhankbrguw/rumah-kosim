<script lang="ts">
	import { MapPin, Lock } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';

	export let form: any;
	export let errors: any;
	export let constraints: any;
	export let userAddresses: any[] = [];

	let selectedAddress = '';

	function handleAddressSelect(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			try {
				const parsed = JSON.parse(target.value);
				form.address = `${parsed.address}, ${parsed.subdistrict}, ${parsed.district}, ${parsed.city}, ${parsed.province} ${parsed.postalCode}`;
			} catch (err) {
				form.address = target.value;
			}
		}
	}
</script>

<div class="rounded-xl border border-surface-alt bg-surface/50 p-5 sm:p-6 lg:p-8 mt-8">
	<h2 class="mb-5 flex items-center gap-2 border-b border-surface-alt pb-3 text-lg font-semibold text-text-main">
		<MapPin size={20} class="text-primary" />
		Location
	</h2>
	<div class="space-y-4">
		{#if userAddresses.length > 0}
			<div class="space-y-1.5">
				<label for="saved_address" class="block text-sm font-medium text-text-muted">{STRINGS.PROFILE.ADDRESS_BOOK.SAVED_ADDRESS}</label>
				<select id="saved_address" bind:value={selectedAddress} on:change={handleAddressSelect} class="w-full rounded-lg border border-surface-alt/80 bg-surface px-4 py-2.5 text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
					<option value="">{STRINGS.PROFILE.ADDRESS_BOOK.SELECT_PLACEHOLDER}</option>
					{#each userAddresses as addr}
						<option value={addr.address_text}>{addr.label} {#if addr.is_primary}({STRINGS.PROFILE.ADDRESS_BOOK.MAIN}){/if}</option>
					{/each}
				</select>
			</div>
		{/if}

		<div class="space-y-1.5">
			<label for="address" class="block text-sm font-medium text-text-muted">{STRINGS.PROFILE.FIELDS.ADDRESS}</label>
			<div class="relative">
			<div class="absolute top-3 left-0 z-10 flex items-center pl-3 pointer-events-none text-text-muted">
				<MapPin size={18} />
			</div>
			<textarea
				id="address"
				name="address"
				rows="3"
				bind:value={form.address}
				{...constraints.address}
				class="w-full rounded-lg border-2 border-surface-alt/80 bg-surface px-4 py-2.5 pl-10 text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				placeholder={STRINGS.PROFILE.FIELDS.ADDRESS_PLACEHOLDER}
			></textarea>
		</div>
		{#if errors.address}<span class="text-xs text-danger">{errors.address}</span>{/if}
	</div>
	</div>
</div>

<div class="rounded-xl border border-surface-alt bg-surface/50 p-5 sm:p-6 lg:p-8 mt-8 mb-8">
	<h2 class="mb-5 flex items-center gap-2 border-b border-surface-alt pb-3 text-lg font-semibold text-text-main">
		<Lock size={20} class="text-primary" />
		Security
	</h2>
	<div class="space-y-1.5">
		<label for="password" class="block text-sm font-medium text-text-muted">{STRINGS.PROFILE.FIELDS.PASSWORD}</label>
		<div class="relative">
			<div class="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none text-text-muted">
				<Lock size={18} />
			</div>
			<input
				type="password"
				id="password"
				name="password"
				bind:value={form.password}
				{...constraints.password}
				class="w-full rounded-lg border-2 border-surface-alt/80 bg-surface px-4 py-2.5 pl-10 text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				placeholder={STRINGS.PROFILE.FIELDS.PASSWORD_PLACEHOLDER}
			/>
		</div>
		{#if errors.password}<span class="text-xs text-danger">{errors.password}</span>{/if}
	</div>
</div>
