<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	import type { Writable } from 'svelte/store';
	export let form: Writable<Record<string, unknown>>;
	export let errors: Writable<Record<string, unknown>>;
	export let enhance: import('sveltekit-superforms').SuperForm<
		Record<string, unknown>,
		unknown
	>['enhance'];
	export let message: Writable<unknown>;

	let showPassword = false;
</script>

<form method="POST" action="?/login" use:enhance transition:fade>
	{#if $message}
		<p class="mb-3 rounded-lg bg-danger-light p-2.5 text-xs text-danger-hover">{$message}</p>
	{/if}
	<div class="mb-3.5 sm:mb-4">
		<label for="login-username" class="mb-1 block text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.SIGNUP.USERNAME_LABEL}</label
		>
		<input
			id="login-username"
			name="username"
			type="text"
			bind:value={$form.username}
			class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
			placeholder={STRINGS.AUTH.SIGNUP.USERNAME_PLACEHOLDER}
			required
		/>
		{#if $errors.username}
			<span class="text-micro text-danger-hover">{$errors.username}</span>
		{/if}
	</div>
	<div class="mb-4 sm:mb-5">
		<label for="login-password" class="mb-1 block text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.LOGIN.PASSWORD_LABEL}</label
		>
		<div class="relative flex items-center">
			<input
				id="login-password"
				name="password"
				type={showPassword ? 'text' : 'password'}
				bind:value={$form.password}
				class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 pr-9 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
				placeholder={STRINGS.AUTH.LOGIN.PASSWORD_PLACEHOLDER}
				required
			/>
			<button
				type="button"
				class="absolute right-2.5 text-text-muted transition-colors hover:text-text-main"
				on:click={() => (showPassword = !showPassword)}
				aria-label={showPassword ? 'Hide password' : 'Show password'}
			>
				{#if showPassword}
					<EyeOff size={16} />
				{:else}
					<Eye size={16} />
				{/if}
			</button>
		</div>
		{#if $errors.password}
			<span class="text-micro text-danger-hover">{$errors.password}</span>
		{/if}
	</div>

	<div class="mb-4 flex justify-end sm:mb-5">
		<button
			type="button"
			class="text-xs font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
			on:click={() => dispatch('forgotPassword')}
		>
			{STRINGS.AUTH.FORGOT_PASSWORD.LINK}
		</button>
	</div>
	<button
		type="submit"
		class="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-xs font-semibold text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
	>
		{STRINGS.AUTH.LOGIN.SUBMIT}
	</button>
</form>
