<script lang="ts">
	import { User, Mail, Phone } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';

	export let form: Record<string, unknown>;
	export let errors: Record<string, string[]>;
	export let constraints: Record<string, Record<string, unknown> | undefined>;

	function handlePhoneInput(e: Event) {
		const target = e.target as HTMLInputElement;
		let rawPhoneValue = target.value;
		let clean = rawPhoneValue.replace(/\D/g, '');

		if (clean.startsWith('62')) {
			clean = clean.substring(2);
		} else if (clean.startsWith('0')) {
			clean = clean.substring(1);
		}

		form.phone = clean;
	}
</script>

<div class="rounded-xl border border-surface-alt bg-surface/50 p-3.5 sm:p-5 lg:p-6">
	<h2
		class="mb-3.5 flex items-center gap-2 border-b border-surface-alt pb-2.5 text-sm font-semibold text-text-main sm:text-base"
	>
		<User size={18} class="text-primary" />
		Personal Details
	</h2>
	<div class="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
		<div class="space-y-1">
			<label for="full_name" class="block text-xs font-semibold text-text-muted"
				>{STRINGS.PROFILE.FIELDS.FULL_NAME}</label
			>
			<div class="relative">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-text-muted"
				>
					<User size={16} />
				</div>
				<input
					type="text"
					id="full_name"
					name="full_name"
					bind:value={form.full_name}
					{...constraints.full_name}
					class="w-full rounded-lg border border-surface-alt/80 bg-surface px-3 py-2 pl-9 text-xs text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
					placeholder={STRINGS.PROFILE.FIELDS.FULL_NAME_PLACEHOLDER}
				/>
			</div>
			{#if errors.full_name}<span class="text-micro text-danger">{errors.full_name}</span>{/if}
		</div>

		<div class="space-y-1">
			<label for="phone" class="block text-xs font-semibold text-text-muted"
				>{STRINGS.PROFILE.FIELDS.PHONE}</label
			>
			<div class="relative flex">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-text-muted"
				>
					<Phone size={16} />
				</div>
				<span
					class="inline-flex items-center rounded-l-lg border-y border-l border-surface-alt/80 bg-surface-alt px-2.5 pl-9 text-xs font-semibold text-text-main sm:text-sm"
				>
					{STRINGS.PROFILE.FIELDS.PHONE_PREFIX}
				</span>
				<input
					type="tel"
					id="phone"
					name="phone"
					bind:value={form.phone}
					on:input={handlePhoneInput}
					{...constraints.phone}
					class="w-full rounded-r-lg border border-surface-alt/80 bg-surface px-3 py-2 text-xs text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
					placeholder={STRINGS.PROFILE.FIELDS.PHONE_PLACEHOLDER}
				/>
			</div>
			{#if errors.phone}<span class="text-micro text-danger">{errors.phone}</span>{/if}
		</div>
	</div>
</div>

<div class="mt-5 rounded-xl border border-surface-alt bg-surface/50 p-3.5 sm:mt-6 sm:p-5 lg:p-6">
	<h2
		class="mb-3.5 flex items-center gap-2 border-b border-surface-alt pb-2.5 text-sm font-semibold text-text-main sm:text-base"
	>
		<Mail size={18} class="text-primary" />
		Account Information
	</h2>
	<div class="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
		<div class="space-y-1">
			<label for="username" class="block text-xs font-semibold text-text-muted"
				>{STRINGS.PROFILE.FIELDS.USERNAME}</label
			>
			<div class="relative">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-text-muted"
				>
					<User size={16} />
				</div>
				<input
					type="text"
					id="username"
					name="username"
					bind:value={form.username}
					{...constraints.username}
					class="w-full rounded-lg border border-surface-alt/80 bg-surface px-3 py-2 pl-9 text-xs text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
				/>
			</div>
			{#if errors.username}<span class="text-micro text-danger">{errors.username}</span>{/if}
		</div>

		<div class="space-y-1">
			<label for="email" class="block text-xs font-semibold text-text-muted"
				>{STRINGS.PROFILE.FIELDS.EMAIL}</label
			>
			<div class="relative">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-text-muted"
				>
					<Mail size={16} />
				</div>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={form.email}
					{...constraints.email}
					pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
					class="w-full rounded-lg border border-surface-alt/80 bg-surface px-3 py-2 pl-9 text-xs text-text-main transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
				/>
			</div>
			{#if errors.email}<span class="text-micro text-danger">{errors.email}</span>{/if}
		</div>
	</div>
</div>
