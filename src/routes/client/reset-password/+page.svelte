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
	<title>{STRINGS.META.RESET_PASSWORD}</title>
</svelte:head>

<div
	class="flex min-h-screen w-full items-center justify-center bg-surface-alt px-3.5 py-12 sm:py-20"
>
	<div
		class="w-full max-w-sm rounded-xl border border-surface-alt/70 bg-surface/95 px-4 py-6 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:px-8 sm:py-8 md:max-w-md"
		transition:fade
	>
		<div class="mb-4 flex flex-col items-center sm:mb-6">
			<div
				class="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner sm:mb-3 sm:h-14 sm:w-14 sm:rounded-2xl"
			>
				<BookOpen size={22} class="sm:h-7 sm:w-7" />
			</div>
			<h2 class="text-center text-lg font-bold tracking-tight text-text-main sm:text-xl">
				{STRINGS.RESET_PASSWORD.TITLE}
			</h2>
			<p class="mt-1 text-center text-xs leading-relaxed text-text-muted">
				{STRINGS.RESET_PASSWORD.SUBTITLE}
			</p>
		</div>

		{#if !data.token}
			<p class="mb-3 rounded-lg bg-danger-light p-2.5 text-center text-xs text-danger-hover">
				Invalid or missing reset token.
			</p>
			<a
				href="/client/auth"
				class="block text-center text-xs font-medium text-primary hover:underline"
				>{STRINGS.RESET_PASSWORD.RETURN_LOGIN}</a
			>
		{:else}
			<form method="POST" use:enhance transition:fade>
				{#if $message && typeof $message === 'string'}
					<p class="mb-3 rounded-lg bg-danger-light p-2.5 text-xs text-danger-hover">{$message}</p>
				{/if}

				<input type="hidden" name="token" bind:value={$form.token} />

				<div class="mb-3.5 sm:mb-4">
					<label for="password" class="mb-1 block text-xs font-semibold text-text-main"
						>New Password</label
					>
					<div class="relative flex items-center">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={$form.password}
							class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 pr-9 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
							placeholder="At least 6 characters"
							required
						/>
						<button
							type="button"
							class="absolute right-2.5 text-text-muted transition-colors hover:text-text-main"
							on:click={() => (showPassword = !showPassword)}
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
					<label for="confirmPassword" class="mb-1 block text-xs font-semibold text-text-main"
						>Confirm New Password</label
					>
					<div class="relative flex items-center">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showPassword ? 'text' : 'password'}
							bind:value={$form.confirmPassword}
							class="w-full rounded-lg border border-surface-alt/70 bg-surface px-3 py-2 pr-9 text-xs text-text-main focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
							placeholder="Confirm password"
							required
						/>
					</div>
					{#if $errors.confirmPassword}
						<span class="text-micro text-danger-hover">{$errors.confirmPassword}</span>
					{/if}
				</div>

				<button
					type="submit"
					class="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-xs font-semibold text-text-inverse shadow-sm transition-colors hover:bg-primary-hover sm:text-sm"
				>
					{STRINGS.RESET_PASSWORD.TITLE}
				</button>
			</form>
		{/if}
	</div>
</div>
