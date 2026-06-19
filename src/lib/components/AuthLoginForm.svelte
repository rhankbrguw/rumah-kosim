<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let form: any;
	export let errors: any;
	export let enhance: any;
	export let message: any;

	let showPassword = false;
</script>

<form method="POST" action="?/login" use:enhance transition:fade>
	{#if $message}
		<p class="mb-4 rounded-md bg-danger-light p-3 text-sm text-danger-hover">{$message}</p>
	{/if}
	<div class="mb-5">
		<label for="login-username" class="mb-1 block font-medium text-text-main">{STRINGS.AUTH.SIGNUP.USERNAME_LABEL}</label>
		<input
			id="login-username"
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
	<div class="mb-6">
		<label for="login-password" class="mb-1 block font-medium text-text-main">{STRINGS.AUTH.LOGIN.PASSWORD_LABEL}</label>
		<div class="relative flex items-center">
			<input
				id="login-password"
				name="password"
				type={showPassword ? "text" : "password"}
				bind:value={$form.password}
				class="w-full rounded-md border border-secondary px-4 py-2 pr-10 focus:border-primary focus:ring-1 focus:ring-primary"
				placeholder={STRINGS.AUTH.LOGIN.PASSWORD_PLACEHOLDER}
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
	
	<div class="mb-6 flex justify-end">
		<button 
			type="button" 
			class="text-sm font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
			on:click={() => dispatch('forgotPassword')}
		>
			{STRINGS.AUTH.FORGOT_PASSWORD.LINK}
		</button>
	</div>
	<button
		type="submit"
		class="w-full rounded-md bg-primary py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
	>
		{STRINGS.AUTH.LOGIN.SUBMIT}
	</button>
</form>
