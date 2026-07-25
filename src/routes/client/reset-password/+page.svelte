<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { BookOpen, Eye, EyeOff } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { STRINGS } from '$lib/constants/strings';

	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: { form: SuperValidated<Record<string, unknown>>; token: string };

	const { form, errors, enhance, message } = superForm(data.form);

	let showPassword = false;
</script>

<svelte:head>
	<title>{STRINGS.RESET_PASSWORD.TITLE} - Rumah Kosim</title>
</svelte:head>

<div class="flex min-h-screen w-full items-center justify-center bg-surface-alt px-4 py-20">
	<div
		class="w-full max-w-sm rounded-lg border border-surface-alt/50 bg-surface/80 px-8 py-10 shadow-md backdrop-blur-md md:max-w-md"
		transition:fade
	>
		<div class="mb-6 flex flex-col items-center">
			<div
				class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
			>
				<BookOpen size={32} />
			</div>
			<h2 class="text-center text-2xl font-bold text-text-main">{STRINGS.RESET_PASSWORD.TITLE}</h2>
			<p class="mt-2 text-center text-sm text-text-muted">{STRINGS.RESET_PASSWORD.SUBTITLE}</p>
		</div>

		{#if !data.token}
			<p class="mb-4 rounded-md bg-danger-light p-3 text-center text-sm text-danger-hover">
				Invalid or missing reset token.
			</p>
			<a
				href="/client/auth"
				class="block text-center text-sm font-medium text-primary hover:underline"
				>{STRINGS.RESET_PASSWORD.RETURN_LOGIN}</a
			>
		{:else}
			<form method="POST" use:enhance transition:fade>
				{#if $message && typeof $message === 'string'}
					<p class="mb-4 rounded-md bg-danger-light p-3 text-sm text-danger-hover">{$message}</p>
				{/if}

				<input type="hidden" name="token" bind:value={$form.token} />

				<div class="mb-5">
					<label for="password" class="mb-1 block font-medium text-text-main">New Password</label>
					<div class="relative flex items-center">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={$form.password}
							class="w-full rounded-md border border-secondary px-4 py-2 pr-10 focus:border-primary focus:ring-1 focus:ring-primary"
							placeholder="At least 6 characters"
							required
						/>
						<button
							type="button"
							class="absolute right-3 text-secondary transition-colors hover:text-text-main"
							on:click={() => (showPassword = !showPassword)}
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
					<label for="confirmPassword" class="mb-1 block font-medium text-text-main"
						>Confirm New Password</label
					>
					<div class="relative flex items-center">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showPassword ? 'text' : 'password'}
							bind:value={$form.confirmPassword}
							class="w-full rounded-md border border-secondary px-4 py-2 pr-10 focus:border-primary focus:ring-1 focus:ring-primary"
							placeholder="Confirm password"
							required
						/>
					</div>
					{#if $errors.confirmPassword}
						<span class="text-sm text-danger-hover">{$errors.confirmPassword}</span>
					{/if}
				</div>

				<button
					type="submit"
					class="w-full rounded-md bg-primary py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
				>
					{STRINGS.RESET_PASSWORD.TITLE}
				</button>
			</form>
		{/if}
	</div>
</div>
