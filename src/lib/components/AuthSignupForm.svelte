<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	import type { Writable } from 'svelte/store';
	export let form: Writable<Record<string, unknown>>;
	export let errors: Writable<Record<string, unknown>>;
	export let enhance: import('sveltekit-superforms').SuperForm<
		Record<string, unknown>,
		unknown
	>['enhance'];
	export let message: Writable<unknown>;

	let showPassword = false;
	let showConfirmPassword = false;
</script>

<form method="POST" action="?/signup" use:enhance transition:fade>
	{#if $message}
		<p class="mb-3 rounded-lg bg-danger-light p-2.5 text-xs text-danger-hover">{$message}</p>
	{/if}
	<div class="mb-3 sm:mb-3.5">
		<label for="signup-username" class="mb-1 block text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.SIGNUP.USERNAME_LABEL}</label
		>
		<input
			id="signup-username"
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
	<div class="mb-3 sm:mb-3.5">
		<label for="signup-email" class="mb-1 block text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.SIGNUP.EMAIL_LABEL}</label
		>
		<input
			id="signup-email"
			name="email"
			type="email"
			bind:value={$form.email}
			class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
			placeholder={STRINGS.AUTH.SIGNUP.EMAIL_PLACEHOLDER}
			required
		/>
		{#if $errors.email}
			<span class="text-micro text-danger-hover">{$errors.email}</span>
		{/if}
	</div>
	<div class="mb-3 sm:mb-3.5">
		<label for="signup-password" class="mb-1 block text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.SIGNUP.PASSWORD_LABEL}</label
		>
		<div class="relative flex items-center">
			<input
				id="signup-password"
				name="password"
				type={showPassword ? 'text' : 'password'}
				bind:value={$form.password}
				class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 pr-9 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
				placeholder={STRINGS.AUTH.SIGNUP.PASSWORD_PLACEHOLDER}
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
	<div class="mb-4 sm:mb-5">
		<label for="signup-confirmPassword" class="mb-1 block text-xs font-semibold text-text-main"
			>{STRINGS.AUTH.SIGNUP.CONFIRM_PASSWORD_LABEL}</label
		>
		<div class="relative flex items-center">
			<input
				id="signup-confirmPassword"
				name="confirmPassword"
				type={showConfirmPassword ? 'text' : 'password'}
				bind:value={$form.confirmPassword}
				class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 pr-9 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
				placeholder={STRINGS.AUTH.SIGNUP.PASSWORD_PLACEHOLDER}
				required
			/>
			<button
				type="button"
				class="absolute right-2.5 text-text-muted transition-colors hover:text-text-main"
				on:click={() => (showConfirmPassword = !showConfirmPassword)}
				aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
			>
				{#if showConfirmPassword}
					<EyeOff size={16} />
				{:else}
					<Eye size={16} />
				{/if}
			</button>
		</div>
		{#if $errors.confirmPassword}
			<span class="text-micro text-danger-hover">{$errors.confirmPassword}</span>
		{/if}
	</div>
	<button
		type="submit"
		class="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-xs font-semibold text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
	>
		{STRINGS.AUTH.SIGNUP.SUBMIT}
	</button>
</form>
