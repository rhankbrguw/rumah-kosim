<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { superForm } from 'sveltekit-superforms';
	import AuthFormViews from './AuthFormViews.svelte';
	import AuthFormHeader from './AuthFormHeader.svelte';
	import { STORAGE_KEYS } from '$lib/constants/storageKeys';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';

	export let data: {
		loginForm: SuperValidated<Record<string, unknown>>;
		signupForm: SuperValidated<Record<string, unknown>>;
		verifyOtpForm: SuperValidated<Record<string, unknown>>;
		forgotPasswordForm: SuperValidated<Record<string, unknown>>;
	};

	let viewMode: 'login' | 'signup' | 'otp' | 'forgot_password' = 'login';
	let pendingUserId: number | null = null;

	const {
		form: loginForm,
		errors: loginErrors,
		enhance: loginEnhance,
		message: loginMessage
	} = superForm(data.loginForm);
	const {
		form: signupForm,
		errors: signupErrors,
		enhance: signupEnhance,
		message: signupMessage
	} = superForm(data.signupForm, {
		onUpdate({ form }) {
			if (form.message?.requiresOtp) {
				pendingUserId = form.message.userId;
				viewMode = 'otp';
			}
		}
	});
	const {
		form: otpForm,
		errors: otpErrors,
		enhance: otpEnhance,
		message: otpMessage
	} = superForm(data.verifyOtpForm);
	const {
		form: forgotForm,
		errors: forgotErrors,
		enhance: forgotEnhance,
		message: forgotMessage
	} = superForm(data.forgotPasswordForm);

	import { onMount } from 'svelte';
	import { loadForm, saveLoginForm, saveSignupForm, saveForgotForm } from './authFormStorage';

	onMount(() => {
		loadForm(STORAGE_KEYS.LOGIN_FORM, loginForm, ['password']);
		loadForm(STORAGE_KEYS.SIGNUP_FORM, signupForm, ['password', 'confirmPassword']);
		loadForm(STORAGE_KEYS.FORGOT_FORM, forgotForm);
	});

	$: if ($loginForm) saveLoginForm($loginForm);
	$: if ($signupForm) saveSignupForm($signupForm);
	$: if ($forgotForm) saveForgotForm($forgotForm);

	$: authTitle =
		viewMode === 'login'
			? STRINGS.META.AUTH_LOGIN
			: viewMode === 'signup'
				? STRINGS.META.AUTH_REGISTER
				: viewMode === 'otp'
					? STRINGS.META.AUTH_OTP
					: STRINGS.META.RESET_PASSWORD;
</script>

<svelte:head>
	<title>{authTitle}</title>
</svelte:head>

<div
	class="flex min-h-screen w-full items-center justify-center bg-surface-alt px-3.5 py-12 sm:py-20"
>
	<div
		class="page-enter w-full max-w-sm rounded-xl border border-surface-alt/70 bg-surface/95 px-4 py-6 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:px-8 sm:py-8 md:max-w-md"
		in:fade={{ duration: 400 }}
	>
		<AuthFormHeader {viewMode} />

		{#if viewMode === 'login' || viewMode === 'signup'}
			<div
				class="mb-6 grid w-full grid-cols-2 rounded-lg bg-surface-alt/60 p-1 backdrop-blur-sm"
				in:fade={{ duration: 300 }}
			>
				<button
					type="button"
					class={`relative cursor-pointer rounded-md py-1.5 text-xs font-semibold transition-all duration-300 sm:py-2 sm:text-sm ${
						viewMode === 'login'
							? 'bg-surface text-primary shadow-sm ring-1 ring-surface-alt'
							: 'text-text-muted hover:text-text-main'
					}`}
					on:click={() => {
						viewMode = 'login';
					}}
				>
					{STRINGS.AUTH.LOGIN.TITLE}
				</button>
				<button
					type="button"
					class={`relative cursor-pointer rounded-md py-1.5 text-xs font-semibold transition-all duration-300 sm:py-2 sm:text-sm ${
						viewMode === 'signup'
							? 'bg-surface text-primary shadow-sm ring-1 ring-surface-alt'
							: 'text-text-muted hover:text-text-main'
					}`}
					on:click={() => {
						viewMode = 'signup';
					}}
				>
					{STRINGS.AUTH.SIGNUP.TITLE}
				</button>
			</div>
		{/if}

		<AuthFormViews
			bind:viewMode
			{pendingUserId}
			{loginForm}
			{loginErrors}
			{loginEnhance}
			{loginMessage}
			{signupForm}
			{signupErrors}
			{signupEnhance}
			{signupMessage}
			{otpForm}
			{otpErrors}
			{otpEnhance}
			{otpMessage}
			{forgotForm}
			{forgotErrors}
			{forgotEnhance}
			{forgotMessage}
		/>
	</div>
</div>
