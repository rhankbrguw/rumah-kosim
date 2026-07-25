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
		<p class="mb-4 rounded-md bg-danger-light p-3 text-sm text-danger-hover">{$message}</p>
	{/if}

	<input type="hidden" name="userId" value={userId} />

	<div class="mb-6">
		<label for="otp" class="mb-2 block text-center font-medium text-text-main"
			>{STRINGS.AUTH.OTP.LABEL}</label
		>
		<p class="mb-4 text-center text-sm text-text-muted">{STRINGS.AUTH.OTP.DESC}</p>
		<input
			id="otp"
			name="otp"
			type="text"
			maxlength="6"
			bind:value={$form.otp}
			class="w-full rounded-md border border-secondary px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] focus:border-primary focus:ring-1 focus:ring-primary"
			placeholder={STRINGS.AUTH.OTP.PLACEHOLDER}
			required
		/>
		{#if $errors.otp}
			<span class="mt-1 block text-center text-sm text-danger-hover">{$errors.otp}</span>
		{/if}
	</div>

	<button
		type="submit"
		class="w-full rounded-md bg-primary py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
	>
		{STRINGS.AUTH.OTP.SUBMIT}
	</button>
</form>
