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
		<p
			class="mb-3 rounded-lg border border-secondary/20 bg-surface-alt p-2.5 text-xs text-text-main"
		>
			{$message}
		</p>
	{/if}

	<div class="mb-4 sm:mb-5">
		<label for="forgot-email" class="mb-1 block text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.FORGOT_PASSWORD.LABEL}</label
		>
		<p class="mb-3 text-xs text-text-muted">{STRINGS.AUTH.FORGOT_PASSWORD.DESC}</p>
		<input
			id="forgot-email"
			name="email"
			type="email"
			bind:value={$form.email}
			class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
			placeholder={STRINGS.AUTH.FORGOT_PASSWORD.PLACEHOLDER}
			required
		/>
		{#if $errors.email}
			<span class="text-micro mt-1 text-danger-hover">{$errors.email}</span>
		{/if}
	</div>

	<button
		type="submit"
		class="mb-2.5 w-full cursor-pointer rounded-lg bg-primary py-2.5 text-xs font-semibold text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
	>
		{STRINGS.AUTH.FORGOT_PASSWORD.SUBMIT}
	</button>

	<button
		type="button"
		class="w-full cursor-pointer rounded-lg bg-surface-alt/80 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-text-main sm:text-sm"
		on:click={onBack}
	>
		{STRINGS.AUTH.FORGOT_PASSWORD.BACK}
	</button>
</form>
