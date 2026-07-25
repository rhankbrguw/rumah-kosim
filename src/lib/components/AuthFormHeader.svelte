<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { BookOpen } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	export let viewMode: 'login' | 'signup' | 'otp' | 'forgot_password';
</script>

<div class="mb-6 flex flex-col items-center">
	<div
		class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner"
	>
		<BookOpen size={32} />
	</div>
	<h2 class="grid grid-cols-1 text-center text-2xl font-bold tracking-tight text-text-main">
		{#if viewMode === 'login'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.LOGIN.TITLE}</span
			>
		{:else if viewMode === 'signup'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.SIGNUP.TITLE}</span
			>
		{:else if viewMode === 'otp'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.OTP.TITLE}</span
			>
		{:else if viewMode === 'forgot_password'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.FORGOT_PASSWORD.TITLE}</span
			>
		{/if}
	</h2>
	<p class="mt-2 grid grid-cols-1 text-center text-sm leading-relaxed text-text-muted">
		{#if viewMode === 'login'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.LOGIN.SUBTITLE}</span
			>
		{:else if viewMode === 'signup'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.SIGNUP.SUBTITLE}</span
			>
		{:else if viewMode === 'otp'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.OTP.SUBTITLE}</span
			>
		{:else if viewMode === 'forgot_password'}
			<span
				class="col-start-1 row-start-1"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}>{STRINGS.AUTH.FORGOT_PASSWORD.SUBTITLE}</span
			>
		{/if}
	</p>
</div>
