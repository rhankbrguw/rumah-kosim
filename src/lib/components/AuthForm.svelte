<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { superForm } from 'sveltekit-superforms';
	import { BookOpen } from 'lucide-svelte';
	import AuthLoginForm from './AuthLoginForm.svelte';
	import AuthSignupForm from './AuthSignupForm.svelte';
	import AuthOtpForm from './AuthOtpForm.svelte';
	import AuthForgotPasswordForm from './AuthForgotPasswordForm.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { fade } from 'svelte/transition';
	
	export let data: { 
		loginForm: SuperValidated<Record<string, unknown>>, 
		signupForm: SuperValidated<Record<string, unknown>>,
		verifyOtpForm: SuperValidated<Record<string, unknown>>,
		forgotPasswordForm: SuperValidated<Record<string, unknown>>
	};

	let viewMode: 'login' | 'signup' | 'otp' | 'forgot_password' = 'login';
	let pendingUserId: number | null = null;

	const { form: loginForm, errors: loginErrors, enhance: loginEnhance, message: loginMessage } = superForm(data.loginForm);
	const { form: signupForm, errors: signupErrors, enhance: signupEnhance, message: signupMessage } = superForm(data.signupForm, {
		onUpdate({ result, form }) {
			if (form.message?.requiresOtp) {
				pendingUserId = form.message.userId;
				viewMode = 'otp';
			}
		}
	});
	const { form: otpForm, errors: otpErrors, enhance: otpEnhance, message: otpMessage } = superForm(data.verifyOtpForm);
	const { form: forgotForm, errors: forgotErrors, enhance: forgotEnhance, message: forgotMessage } = superForm(data.forgotPasswordForm);

</script>

<div class="flex min-h-screen w-full items-center justify-center bg-surface-alt px-4 py-20">
	<div class="w-full max-w-sm rounded-lg border border-surface-alt/50 bg-surface/80 px-8 py-10 shadow-md backdrop-blur-md md:max-w-md" transition:fade>
		<div class="mb-6 flex flex-col items-center">
			<div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
				<BookOpen size={32} />
			</div>
			<h2 class="text-2xl font-bold text-text-main text-center">
				{#if viewMode === 'login'}
					{STRINGS.AUTH.LOGIN.TITLE}
				{:else if viewMode === 'signup'}
					{STRINGS.AUTH.SIGNUP.TITLE}
				{:else if viewMode === 'otp'}
					{STRINGS.AUTH.OTP.TITLE}
				{:else if viewMode === 'forgot_password'}
					{STRINGS.AUTH.FORGOT_PASSWORD.TITLE}
				{/if}
			</h2>
			<p class="mt-2 text-sm text-text-muted text-center">
				{#if viewMode === 'login'}
					{STRINGS.AUTH.LOGIN.SUBTITLE}
				{:else if viewMode === 'signup'}
					{STRINGS.AUTH.SIGNUP.SUBTITLE}
				{:else if viewMode === 'otp'}
					{STRINGS.AUTH.OTP.SUBTITLE}
				{:else if viewMode === 'forgot_password'}
					{STRINGS.AUTH.FORGOT_PASSWORD.SUBTITLE}
				{/if}
			</p>
		</div>
		
		{#if viewMode === 'login' || viewMode === 'signup'}
			<!-- TABS -->
			<div class="mb-8 flex rounded-lg bg-surface-alt p-1">
				<button 
					type="button"
					class={`w-1/2 rounded-md py-2 text-sm font-medium transition-all ${viewMode === 'login' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
					on:click={() => { viewMode = 'login'; }}
				>
					{STRINGS.AUTH.LOGIN.TITLE}
				</button>
				<button 
					type="button"
					class={`w-1/2 rounded-md py-2 text-sm font-medium transition-all ${viewMode === 'signup' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
					on:click={() => { viewMode = 'signup'; }}
				>
					{STRINGS.AUTH.SIGNUP.TITLE}
				</button>
			</div>
		{/if}

		{#if viewMode === 'login'}
			<AuthLoginForm form={loginForm} errors={loginErrors} enhance={loginEnhance} message={loginMessage} on:forgotPassword={() => viewMode = 'forgot_password'} />
		{:else if viewMode === 'signup'}
			<AuthSignupForm form={signupForm} errors={signupErrors} enhance={signupEnhance} message={signupMessage} />
		{:else if viewMode === 'otp'}
			<AuthOtpForm form={otpForm} errors={otpErrors} enhance={otpEnhance} message={otpMessage} userId={pendingUserId} />
		{:else if viewMode === 'forgot_password'}
			<AuthForgotPasswordForm form={forgotForm} errors={forgotErrors} enhance={forgotEnhance} message={forgotMessage} onBack={() => viewMode = 'login'} />
		{/if}
	</div>
</div>
