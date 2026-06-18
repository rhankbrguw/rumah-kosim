<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: SuperValidated<Record<string, unknown>>;

	const { form, errors, enhance, message } = superForm(data);
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-surface-alt px-4 py-20">
	<div class="w-full max-w-sm rounded-lg border border-surface-alt/50 bg-surface/80 px-6 py-8 shadow-md backdrop-blur-md md:max-w-md">
		<h2 class="mb-8 text-2xl font-bold text-text-main">{STRINGS.AUTH.SIGNUP.TITLE}</h2>
		
		<form method="POST" use:enhance>
			{#if $message}
				<p class="mb-4 rounded-md bg-danger-light p-3 text-sm text-danger-hover">{$message}</p>
			{/if}
			<div class="mb-5">
				<label for="username" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.USERNAME_LABEL}</label>
				<input
					id="username"
					name="username"
					type="text"
					bind:value={$form.username}
					class="w-full rounded-md border border-secondary px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
					required
				/>
				{#if $errors.username}
					<span class="text-sm text-danger-hover">{$errors.username}</span>
				{/if}
			</div>
			<div class="mb-5">
				<label for="email" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.EMAIL_LABEL}</label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={$form.email}
					class="w-full rounded-md border border-secondary px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
					required
				/>
				{#if $errors.email}
					<span class="text-sm text-danger-hover">{$errors.email}</span>
				{/if}
			</div>
			<div class="mb-5">
				<label for="password" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.PASSWORD_LABEL}</label>
				<input
					id="password"
					name="password"
					type="password"
					bind:value={$form.password}
					class="w-full rounded-md border border-secondary px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
					required
				/>
				{#if $errors.password}
					<span class="text-sm text-danger-hover">{$errors.password}</span>
				{/if}
			</div>
			<div class="mb-5">
				<label for="confirmPassword" class="mb-1 block text-sm font-medium text-text-main">{STRINGS.AUTH.SIGNUP.CONFIRM_PASSWORD_LABEL}</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					bind:value={$form.confirmPassword}
					class="w-full rounded-md border border-secondary px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
					required
				/>
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
	</div>
</div>
