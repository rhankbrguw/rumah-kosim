<script lang="ts">
	import { User, Mail, Phone } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';

	export let form: any;
	export let errors: any;
	export let constraints: any;

	function handlePhoneInput(e: Event) {
		const target = e.target as HTMLInputElement;
		let val = target.value;
		let clean = val.replace(/\D/g, '');
		
		if (clean.startsWith('62')) {
			clean = clean.substring(2);
		} else if (clean.startsWith('0')) {
			clean = clean.substring(1);
		}
		
		form.phone = clean;
	}
</script>

<div class="rounded-xl border border-surface-alt bg-surface/50 p-5 sm:p-6 lg:p-8">
	<h2 class="mb-5 flex items-center gap-2 border-b border-surface-alt pb-3 text-lg font-semibold text-text-main">
		<User size={20} class="text-primary" />
		Personal Details
	</h2>
	<div class="grid gap-5 sm:grid-cols-2 lg:gap-6">
		<div class="space-y-1.5">
			<label for="full_name" class="block text-sm font-medium text-text-muted">{STRINGS.PROFILE.FIELDS.FULL_NAME}</label>
			<div class="relative">
				<div class="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none text-text-muted">
					<User size={18} />
				</div>
				<input
					type="text"
					id="full_name"
					name="full_name"
					bind:value={form.full_name}
					{...constraints.full_name}
					class="w-full rounded-lg border-2 border-surface-alt/80 bg-surface px-4 py-2.5 pl-10 text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					placeholder={STRINGS.PROFILE.FIELDS.FULL_NAME_PLACEHOLDER}
				/>
			</div>
			{#if errors.full_name}<span class="text-xs text-danger">{errors.full_name}</span>{/if}
		</div>

		<div class="space-y-1.5">
			<label for="phone" class="block text-sm font-medium text-text-muted">{STRINGS.PROFILE.FIELDS.PHONE}</label>
			<div class="relative flex">
				<div class="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none text-text-muted">
					<Phone size={18} />
				</div>
				<span class="inline-flex items-center rounded-l-lg border-y-2 border-l-2 border-surface-alt/80 bg-surface-alt px-3 pl-10 text-sm font-semibold text-text-main">
					{STRINGS.PROFILE.FIELDS.PHONE_PREFIX}
				</span>
				<input
					type="tel"
					id="phone"
					name="phone"
					bind:value={form.phone}
					on:input={handlePhoneInput}
					{...constraints.phone}
					class="w-full rounded-r-lg border-2 border-surface-alt/80 bg-surface px-4 py-2.5 text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					placeholder={STRINGS.PROFILE.FIELDS.PHONE_PLACEHOLDER}
				/>
			</div>
			{#if errors.phone}<span class="text-xs text-danger">{errors.phone}</span>{/if}
		</div>
	</div>
</div>

<div class="rounded-xl border border-surface-alt bg-surface/50 p-5 sm:p-6 lg:p-8 mt-8">
	<h2 class="mb-5 flex items-center gap-2 border-b border-surface-alt pb-3 text-lg font-semibold text-text-main">
		<Mail size={20} class="text-primary" />
		Account Information
	</h2>
	<div class="grid gap-5 sm:grid-cols-2 lg:gap-6">
		<div class="space-y-1.5">
			<label for="username" class="block text-sm font-medium text-text-muted">{STRINGS.PROFILE.FIELDS.USERNAME}</label>
			<div class="relative">
				<div class="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none text-text-muted">
					<User size={18} />
				</div>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={form.username}
					{...constraints.username}
					class="w-full rounded-lg border-2 border-surface-alt/80 bg-surface px-4 py-2.5 pl-10 text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			{#if errors.username}<span class="text-xs text-danger">{errors.username}</span>{/if}
		</div>

		<div class="space-y-1.5">
			<label for="email" class="block text-sm font-medium text-text-muted">{STRINGS.PROFILE.FIELDS.EMAIL}</label>
			<div class="relative">
				<div class="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none text-text-muted">
					<Mail size={18} />
				</div>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={form.email}
					{...constraints.email}
					class="w-full rounded-lg border-2 border-surface-alt/80 bg-surface px-4 py-2.5 pl-10 text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</div>
			{#if errors.email}<span class="text-xs text-danger">{errors.email}</span>{/if}
		</div>
	</div>
</div>
