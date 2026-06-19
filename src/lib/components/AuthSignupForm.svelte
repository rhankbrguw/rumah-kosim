<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let form: any;
	export let errors: any;
	export let enhance: any;
	export let message: any;

	let showPassword = false;
	let showConfirmPassword = false;
</script>

<form method="POST" action="?/signup" use:enhance transition:fade>
	{#if $message}
		<p class="mb-4 rounded-md bg-danger-light p-3 text-sm text-danger-hover">{$message}</p>
	{/if}
	<div class="mb-4">
		<label for="signup-username" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.USERNAME_LABEL}</label>
		<input
			id="signup-username"
			name="username"
			type="text"
			bind:value={$form.username}
			class="w-full rounded-md border border-secondary px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
			placeholder={STRINGS.AUTH.SIGNUP.USERNAME_PLACEHOLDER}
			required
		/>
		{#if $errors.username}
			<span class="text-sm text-danger-hover">{$errors.username}</span>
		{/if}
	</div>
	<div class="mb-4">
		<label for="signup-email" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.EMAIL_LABEL}</label>
		<input
			id="signup-email"
			name="email"
			type="email"
			bind:value={$form.email}
			class="w-full rounded-md border border-secondary px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
			placeholder={STRINGS.AUTH.SIGNUP.EMAIL_PLACEHOLDER}
			required
		/>
		{#if $errors.email}
			<span class="text-sm text-danger-hover">{$errors.email}</span>
		{/if}
	</div>
	<div class="mb-4">
		<label for="signup-password" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.PASSWORD_LABEL}</label>
		<div class="relative flex items-center">
			<input
				id="signup-password"
				name="password"
				type={showPassword ? "text" : "password"}
				bind:value={$form.password}
				class="w-full rounded-md border border-secondary px-4 py-2 pr-10 focus:border-primary focus:ring-1 focus:ring-primary"
				placeholder={STRINGS.AUTH.SIGNUP.PASSWORD_PLACEHOLDER}
				required
			/>
			<button
				type="button"
				class="absolute right-3 text-secondary transition-colors hover:text-text-main"
				on:click={() => (showPassword = !showPassword)}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{#if showPassword}
					<EyeOff size={20} />
				{:else}
					<Eye size={20} />
				{/if}
			</button>
		</div>
		{#if $errors.password}
			<span class="text-sm text-danger-hover">{$errors.password}</span>
		{/if}
	</div>
	<div class="mb-6">
		<label for="signup-confirmPassword" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.CONFIRM_PASSWORD_LABEL}</label>
		<div class="relative flex items-center">
			<input
				id="signup-confirmPassword"
				name="confirmPassword"
				type={showConfirmPassword ? "text" : "password"}
				bind:value={$form.confirmPassword}
				class="w-full rounded-md border border-secondary px-4 py-2 pr-10 focus:border-primary focus:ring-1 focus:ring-primary"
				placeholder={STRINGS.AUTH.SIGNUP.PASSWORD_PLACEHOLDER}
				required
			/>
			<button
				type="button"
				class="absolute right-3 text-secondary transition-colors hover:text-text-main"
				on:click={() => (showConfirmPassword = !showConfirmPassword)}
				aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
			>
				{#if showConfirmPassword}
					<EyeOff size={20} />
				{:else}
					<Eye size={20} />
				{/if}
			</button>
		</div>
		{#if $errors.confirmPassword}
			<span class="text-sm text-danger-hover">{$errors.confirmPassword}</span>
		{/if}
	</div>
	<button
		type="submit"
		class="w-full rounded-md bg-primary py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
	>
		{STRINGS.AUTH.SIGNUP.SUBMIT}
	</button>
</form>
