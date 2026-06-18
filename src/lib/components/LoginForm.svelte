<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: SuperValidated<Record<string, unknown>>;

	const { form, errors, enhance, message } = superForm(data);
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-surface-alt px-4 py-20">
	<div class="w-full max-w-sm rounded-lg border border-surface-alt/50 bg-surface/80 px-8 py-12 shadow-md backdrop-blur-md md:max-w-md">
		<h2 class="mb-6 text-2xl font-bold text-text-main">{STRINGS.AUTH.LOGIN.TITLE}</h2>
		
		<form method="POST" use:enhance>
			{#if $message}
				<p class="mb-4 rounded-md bg-danger-light p-3 text-sm text-danger-hover">{$message}</p>
			{/if}
			<div class="mb-5">
				<label for="username" class="mb-1 block font-medium text-text-main">{STRINGS.AUTH.SIGNUP.USERNAME_LABEL}</label>
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
			<div class="mb-6">
				<label for="password" class="mb-1 block font-medium text-text-main">{STRINGS.AUTH.LOGIN.PASSWORD_LABEL}</label>
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
			<button
				type="submit"
				class="w-full rounded-md bg-primary py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
			>
				{STRINGS.AUTH.LOGIN.SUBMIT}
			</button>
		</form>
	</div>
</div>
