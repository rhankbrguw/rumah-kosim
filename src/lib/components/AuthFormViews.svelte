<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import AuthLoginForm from './AuthLoginForm.svelte';
	import AuthSignupForm from './AuthSignupForm.svelte';
	import AuthOtpForm from './AuthOtpForm.svelte';
	import AuthForgotPasswordForm from './AuthForgotPasswordForm.svelte';

	export let viewMode: 'login' | 'signup' | 'otp' | 'forgot_password';
	export let pendingUserId: number | null;

	import type { Writable } from 'svelte/store';
	export let loginForm: Writable<Record<string, unknown>>,
		loginErrors: import('sveltekit-superforms').SuperForm<
			Record<string, unknown>,
			unknown
		>['errors'],
		loginEnhance: import('sveltekit-superforms').SuperForm<
			Record<string, unknown>,
			unknown
		>['enhance'],
		loginMessage: Writable<string | undefined>;

	export let signupForm: Writable<Record<string, unknown>>,
		signupErrors: import('sveltekit-superforms').SuperForm<
			Record<string, unknown>,
			unknown
		>['errors'],
		signupEnhance: import('sveltekit-superforms').SuperForm<
			Record<string, unknown>,
			unknown
		>['enhance'],
		signupMessage: Writable<string | undefined>;

	export let otpForm: Writable<Record<string, unknown>>,
		otpErrors: import('sveltekit-superforms').SuperForm<Record<string, unknown>, unknown>['errors'],
		otpEnhance: import('sveltekit-superforms').SuperForm<
			Record<string, unknown>,
			unknown
		>['enhance'],
		otpMessage: Writable<string | undefined>;

	export let forgotForm: Writable<Record<string, unknown>>,
		forgotErrors: import('sveltekit-superforms').SuperForm<
			Record<string, unknown>,
			unknown
		>['errors'],
		forgotEnhance: import('sveltekit-superforms').SuperForm<
			Record<string, unknown>,
			unknown
		>['enhance'],
		forgotMessage: Writable<string | undefined>;
</script>

<div class="grid grid-cols-1">
	{#if viewMode === 'login'}
		<div
			class="col-start-1 row-start-1"
			in:fly={{ y: 20, duration: 300, delay: 150 }}
			out:fade={{ duration: 150 }}
		>
			<AuthLoginForm
				form={loginForm}
				errors={loginErrors}
				enhance={loginEnhance}
				message={loginMessage}
				on:forgotPassword={() => (viewMode = 'forgot_password')}
			/>
		</div>
	{:else if viewMode === 'signup'}
		<div
			class="col-start-1 row-start-1"
			in:fly={{ y: 20, duration: 300, delay: 150 }}
			out:fade={{ duration: 150 }}
		>
			<AuthSignupForm
				form={signupForm}
				errors={signupErrors}
				enhance={signupEnhance}
				message={signupMessage}
			/>
		</div>
	{:else if viewMode === 'otp'}
		<div
			class="col-start-1 row-start-1"
			in:fly={{ y: 20, duration: 300, delay: 150 }}
			out:fade={{ duration: 150 }}
		>
			<AuthOtpForm
				form={otpForm}
				errors={otpErrors}
				enhance={otpEnhance}
				message={otpMessage}
				userId={pendingUserId}
			/>
		</div>
	{:else if viewMode === 'forgot_password'}
		<div
			class="col-start-1 row-start-1"
			in:fly={{ y: 20, duration: 300, delay: 150 }}
			out:fade={{ duration: 150 }}
		>
			<AuthForgotPasswordForm
				form={forgotForm}
				errors={forgotErrors}
				enhance={forgotEnhance}
				message={forgotMessage}
				onBack={() => (viewMode = 'login')}
			/>
		</div>
	{/if}
</div>
