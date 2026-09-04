<script lang="ts">
	import { fade } from 'svelte/transition';
	import { STRINGS } from '$lib/constants/strings';

	import type { Writable } from 'svelte/store';
	export let form: Writable<Record<string, unknown>>;
	export let errors: Writable<Record<string, unknown>>;
	export let enhance: import('sveltekit-superforms').SuperForm<
		Record<string, unknown>,
		unknown
	>['enhance'];
	export let message: Writable<unknown>;
	export let userId: number | null = null;
</script>

<form method="POST" action="?/verifyOtp" use:enhance transition:fade>
	{#if $message && typeof $message === 'string'}
		<p class="mb-3 rounded-lg bg-danger-light p-2.5 text-xs text-danger-hover">{$message}</p>
	{/if}

	<input type="hidden" name="userId" value={userId} />

	<div class="mb-4 sm:mb-5">
		<label for="otp" class="mb-1.5 block text-center text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.OTP.LABEL}</label
		>
		<p class="mb-3 text-center text-xs text-text-muted">{STRINGS.AUTH.OTP.DESC}</p>
		<input
			id="otp"
			name="otp"
			type="text"
			maxlength="6"
			bind:value={$form.otp}
			class="tracking-display w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 text-center font-mono text-lg focus:border-primary focus:ring-1 focus:ring-primary sm:text-xl"
			placeholder={STRINGS.AUTH.OTP.PLACEHOLDER}
			required
		/>
		{#if $errors.otp}
			<span class="text-micro mt-1 block text-center text-danger-hover">{$errors.otp}</span>
		{/if}
	</div>

	<button
		type="submit"
		class="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-xs font-semibold text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
	>
		{STRINGS.AUTH.OTP.SUBMIT}
	</button>
</form>
