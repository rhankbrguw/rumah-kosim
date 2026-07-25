import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import {
	loginUser,
	registerUser,
	verifyUserOtp,
	processForgotPassword
} from '$lib/server/services/authService.js';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';

import {
	loginFormSchema,
	signupFormSchema,
	verifyOtpSchema,
	forgotPasswordSchema
} from './schemas.js';

export const load = async () => {
	const loginForm = await superValidate(zod(loginFormSchema), { id: 'loginForm' });
	const signupForm = await superValidate(zod(signupFormSchema), { id: 'signupForm' });
	const verifyOtpForm = await superValidate(zod(verifyOtpSchema), { id: 'verifyOtpForm' });
	const forgotPasswordForm = await superValidate(zod(forgotPasswordSchema), {
		id: 'forgotPasswordForm'
	});
	return { loginForm, signupForm, verifyOtpForm, forgotPasswordForm };
};

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginFormSchema), { id: 'loginForm' });
		if (!form.valid) return fail(422, { form });

		const { username, password } = form.data;

		try {
			const { user, token } = await loginUser(username as string, password as string, true);
			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 86400
			});
			throw redirect(303, user.role === 'admin' ? '/admin' : '/client/shop');
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Login error:', error as Error);
			const errObj = error as { message?: string };
			if (errObj.message === 'ACCOUNT_NOT_VERIFIED') {
				return message(form, 'Account is not verified. Please check your email for OTP.', {
					status: 401
				});
			} else if (errObj.message === 'INVALID_CREDENTIALS') {
				return message(form, STRINGS.AUTH.MESSAGES.INVALID_CREDENTIALS, { status: 401 });
			}
			return message(form, STRINGS.AUTH.MESSAGES.DB_ERROR_LOGIN, { status: 500 });
		}
	},
	signup: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signupFormSchema), { id: 'signupForm' });
		if (!form.valid) return fail(422, { form });

		const { username, password, email } = form.data;
		try {
			const result = await registerUser(username as string, password as string, email as string);

			if (result.isFirstUser && result.token) {
				cookies.set('authToken', result.token, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 86400
				});
				throw redirect(303, '/admin');
			} else {
				return message(form, { requiresOtp: true, userId: result.user!.id, email: email });
			}
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Registration error:', error as Error);
			if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
				return message(form, STRINGS.AUTH.MESSAGES.CONFLICT_USER, { status: 409 });
			}
			return message(form, 'DB Error: ' + (error as Error).message, { status: 500 });
		}
	},
	verifyOtp: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(verifyOtpSchema), { id: 'verifyOtpForm' });
		if (!form.valid) return fail(422, { form });

		try {
			const { token } = await verifyUserOtp(form.data.userId, form.data.otp);
			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 86400
			});
			throw redirect(303, '/client/shop');
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('OTP error:', error as Error);
			const errObj = error as { message?: string };
			if (errObj.message === 'INVALID_OTP')
				return message(form, 'Invalid or expired OTP', { status: 400 });
			if (errObj.message === 'USER_NOT_FOUND')
				return message(form, 'User not found', { status: 404 });
			return message(form, 'Failed to verify OTP', { status: 500 });
		}
	},
	forgotPassword: async ({ request }) => {
		const form = await superValidate(request, zod(forgotPasswordSchema), {
			id: 'forgotPasswordForm'
		});
		if (!form.valid) return fail(422, { form });

		try {
			await processForgotPassword(form.data.email);
			return message(form, 'If your email is registered, a reset link has been sent.');
		} catch (error) {
			logger.error('Forgot password error:', error as Error);
			return message(form, 'Failed to process request', { status: 500 });
		}
	}
};
