import type { RequestEvent } from '@sveltejs/kit';

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
import { AUTH_COOKIE_OPTIONS, HTTP_STATUS } from '$lib/constants/config.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';
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
	login: async ({ request, cookies }: RequestEvent) => {
		const form = await superValidate(request, zod(loginFormSchema), { id: 'loginForm' });
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });

		const { username, password } = form.data;

		try {
			const { user, token } = await loginUser(username as string, password as string, true);
			cookies.set('authToken', token, AUTH_COOKIE_OPTIONS);
			throw redirect(
				HTTP_STATUS.SEE_OTHER,
				user.role === 'admin' ? CLIENT_ROUTES.ADMIN : CLIENT_ROUTES.SHOP
			);
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Login error:', error as Error);
			const errObj = error as { message?: string };
			if (errObj.message === 'ACCOUNT_NOT_VERIFIED') {
				return message(form, STRINGS.AUTH.MESSAGES.ACCOUNT_NOT_VERIFIED, {
					status: HTTP_STATUS.UNAUTHORIZED
				});
			} else if (errObj.message === 'INVALID_CREDENTIALS') {
				return message(form, STRINGS.AUTH.MESSAGES.INVALID_CREDENTIALS, {
					status: HTTP_STATUS.UNAUTHORIZED
				});
			}
			return message(form, STRINGS.AUTH.MESSAGES.DB_ERROR_LOGIN, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	},
	signup: async ({ request, cookies }: RequestEvent) => {
		const form = await superValidate(request, zod(signupFormSchema), { id: 'signupForm' });
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });

		const { username, password, email } = form.data;
		try {
			const result = await registerUser(username as string, password as string, email as string);

			if (result.isFirstUser && result.token) {
				cookies.set('authToken', result.token, AUTH_COOKIE_OPTIONS);
				throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.ADMIN);
			} else {
				return message(form, { requiresOtp: true, userId: result.user!.id, email: email });
			}
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Registration error:', error as Error);
			if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
				return message(form, STRINGS.AUTH.MESSAGES.CONFLICT_USER, { status: HTTP_STATUS.CONFLICT });
			}
			return message(form, STRINGS.AUTH.MESSAGES.DB_ERROR_REGISTER, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	},
	verifyOtp: async ({ request, cookies }: RequestEvent) => {
		const form = await superValidate(request, zod(verifyOtpSchema), { id: 'verifyOtpForm' });
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });

		try {
			const { token } = await verifyUserOtp(form.data.userId, form.data.otp);
			cookies.set('authToken', token, AUTH_COOKIE_OPTIONS);
			throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.SHOP);
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('OTP error:', error as Error);
			const errObj = error as { message?: string };
			if (errObj.message === 'INVALID_OTP')
				return message(form, STRINGS.AUTH.MESSAGES.INVALID_OTP, {
					status: HTTP_STATUS.BAD_REQUEST
				});
			if (errObj.message === 'USER_NOT_FOUND')
				return message(form, STRINGS.AUTH.MESSAGES.USER_NOT_FOUND, {
					status: HTTP_STATUS.NOT_FOUND
				});
			return message(form, STRINGS.AUTH.MESSAGES.OTP_VERIFY_FAILED, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	},
	forgotPassword: async ({ request }: RequestEvent) => {
		const form = await superValidate(request, zod(forgotPasswordSchema), {
			id: 'forgotPasswordForm'
		});
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });

		try {
			await processForgotPassword(form.data.email);
			return message(form, STRINGS.AUTH.MESSAGES.FORGOT_PASSWORD_SUCCESS);
		} catch (error) {
			logger.error('Forgot password error:', error as Error);
			return message(form, STRINGS.AUTH.MESSAGES.FORGOT_PASSWORD_FAILED, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	}
};
