<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { superForm } from 'sveltekit-superforms';
	import { BookOpen } from 'lucide-svelte';
	import AuthLoginForm from './AuthLoginForm.svelte';
	import AuthSignupForm from './AuthSignupForm.svelte';
	import AuthOtpForm from './AuthOtpForm.svelte';
	import AuthForgotPasswordForm from './AuthForgotPasswordForm.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { fade, fly } from 'svelte/transition';
	
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

	import { onMount } from 'svelte';
	
	onMount(() => {
		if (typeof window !== 'undefined') {
			const load = (key: string, store: any, omit: string[] = []) => {
				const saved = localStorage.getItem(key);
				if (saved) {
					try {
						const data = JSON.parse(saved);
						omit.forEach(k => delete data[k]);
						Object.assign(store, data);
					} catch {}
				}
			};
			load('loginForm', $loginForm, ['password']);
			load('signupForm', $signupForm, ['password', 'confirmPassword']);
			load('forgotForm', $forgotForm);
		}
	});

	$: if ($loginForm && typeof window !== 'undefined') {
		const data = { ...$loginForm }; delete data.password;
		localStorage.setItem('loginForm', JSON.stringify(data));
	}
	$: if ($signupForm && typeof window !== 'undefined') {
		const data = { ...$signupForm }; delete data.password; delete data.confirmPassword;
		localStorage.setItem('signupForm', JSON.stringify(data));
	}
	$: if ($forgotForm && typeof window !== 'undefined') {
		localStorage.setItem('forgotForm', JSON.stringify($forgotForm));
	}
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-surface-alt px-4 py-20">
	<div class="w-full max-w-sm rounded-2xl border border-secondary/20 bg-surface/90 px-8 py-10 shadow-2xl shadow-primary/5 backdrop-blur-xl md:max-w-md" in:fade={{ duration: 400 }}>
		<div class="mb-6 flex flex-col items-center">
			<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
				<BookOpen size={32} />
			</div>
			<h2 class="grid text-2xl font-bold text-text-main text-center tracking-tight" style="grid-template-columns: 1fr;">
				{#if viewMode === 'login'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.LOGIN.TITLE}</span>
				{:else if viewMode === 'signup'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.SIGNUP.TITLE}</span>
				{:else if viewMode === 'otp'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.OTP.TITLE}</span>
				{:else if viewMode === 'forgot_password'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.FORGOT_PASSWORD.TITLE}</span>
				{/if}
			</h2>
			<p class="grid mt-2 text-sm text-text-muted text-center leading-relaxed" style="grid-template-columns: 1fr;">
				{#if viewMode === 'login'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.LOGIN.SUBTITLE}</span>
				{:else if viewMode === 'signup'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.SIGNUP.SUBTITLE}</span>
				{:else if viewMode === 'otp'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.OTP.SUBTITLE}</span>
				{:else if viewMode === 'forgot_password'}
					<span class="col-start-1 row-start-1" in:fly={{ y: 10, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>{STRINGS.AUTH.FORGOT_PASSWORD.SUBTITLE}</span>
				{/if}
			</p>
		</div>
		
		{#if viewMode === 'login' || viewMode === 'signup'}
			<div class="mb-8 grid w-full grid-cols-2 rounded-xl bg-surface-alt/50 p-1 backdrop-blur-sm" in:fade={{ duration: 300 }}>
				<button 
					type="button"
					class={`relative rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${viewMode === 'login' ? 'bg-surface text-primary shadow-sm ring-1 ring-secondary/10' : 'text-text-muted hover:text-text-main'}`}
					on:click={() => { viewMode = 'login'; }}
				>
					{STRINGS.AUTH.LOGIN.TITLE}
				</button>
				<button 
					type="button"
					class={`relative rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${viewMode === 'signup' ? 'bg-surface text-primary shadow-sm ring-1 ring-secondary/10' : 'text-text-muted hover:text-text-main'}`}
					on:click={() => { viewMode = 'signup'; }}
				>
					{STRINGS.AUTH.SIGNUP.TITLE}
				</button>
			</div>
		{/if}

		<div class="grid" style="grid-template-columns: 1fr;">
			{#if viewMode === 'login'}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>
					<AuthLoginForm form={loginForm} errors={loginErrors} enhance={loginEnhance} message={loginMessage} on:forgotPassword={() => viewMode = 'forgot_password'} />
				</div>
			{:else if viewMode === 'signup'}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>
					<AuthSignupForm form={signupForm} errors={signupErrors} enhance={signupEnhance} message={signupMessage} />
				</div>
			{:else if viewMode === 'otp'}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>
					<AuthOtpForm form={otpForm} errors={otpErrors} enhance={otpEnhance} message={otpMessage} userId={pendingUserId} />
				</div>
			{:else if viewMode === 'forgot_password'}
				<div class="col-start-1 row-start-1" in:fly={{ y: 20, duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>
					<AuthForgotPasswordForm form={forgotForm} errors={forgotErrors} enhance={forgotEnhance} message={forgotMessage} onBack={() => viewMode = 'login'} />
				</div>
			{/if}
		</div>
	</div>
</div>
