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
	export let onBack: () => void;
</script>

<form method="POST" action="?/forgotPassword" use:enhance transition:fade>
	{#if $message && typeof $message === 'string'}
		<p class="mb-4 rounded-md border border-secondary/20 bg-surface-alt p-3 text-sm text-text-main">
			{$message}
		</p>
	{/if}

	<div class="mb-6">
		<label for="forgot-email" class="mb-1 block font-medium text-text-main"
			>{STRINGS.AUTH.FORGOT_PASSWORD.LABEL}</label
		>
		<p class="mb-4 text-sm text-text-muted">{STRINGS.AUTH.FORGOT_PASSWORD.DESC}</p>
		<input
			id="forgot-email"
			name="email"
			type="email"
			bind:value={$form.email}
			class="w-full rounded-md border border-secondary px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
			placeholder={STRINGS.AUTH.FORGOT_PASSWORD.PLACEHOLDER}
			required
		/>
		{#if $errors.email}
			<span class="mt-1 text-sm text-danger-hover">{$errors.email}</span>
		{/if}
	</div>

	<button
		type="submit"
		class="mb-3 w-full rounded-md bg-primary py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
	>
		{STRINGS.AUTH.FORGOT_PASSWORD.SUBMIT}
	</button>

	<button
		type="button"
		class="w-full rounded-md bg-surface-alt py-3 font-medium text-text-muted transition-colors hover:bg-secondary/10 hover:text-text-main"
		on:click={onBack}
	>
		{STRINGS.AUTH.FORGOT_PASSWORD.BACK}
	</button>
</form>
