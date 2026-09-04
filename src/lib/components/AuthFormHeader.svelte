<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { BookOpen } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	export let viewMode: 'login' | 'signup' | 'otp' | 'forgot_password';
</script>

<div class="mb-4 flex flex-col items-center sm:mb-6">
	<div
		class="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner sm:mb-3 sm:h-14 sm:w-14 sm:rounded-2xl"
	>
		<BookOpen size={22} class="sm:h-7 sm:w-7" />
	</div>
	<h2
		class="grid grid-cols-1 text-center text-lg font-bold tracking-tight text-text-main sm:text-xl"
	>
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
	<p class="mt-1 grid grid-cols-1 text-center text-xs leading-relaxed text-text-muted">
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
