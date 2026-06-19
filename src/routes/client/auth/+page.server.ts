import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { APP_CONFIG } from '$lib/constants/config.js';
import { getUserByUsername, getUserByEmail, getUserById, createUser, setOTP, verifyOTP, setResetToken } from '$lib/server/services/authService.js';
import { sendOTP, sendResetPassword } from '$lib/server/utils/mailer.js';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { STRINGS } from '$lib/constants/strings.js';
import { logger } from '$lib/server/utils/logger.js';
import crypto from 'crypto';

import { loginFormSchema, signupFormSchema, verifyOtpSchema, forgotPasswordSchema } from './schemas.js';

export const load = async () => {
	const loginForm = await superValidate(zod(loginFormSchema), { id: 'loginForm' });
	const signupForm = await superValidate(zod(signupFormSchema), { id: 'signupForm' });
	const verifyOtpForm = await superValidate(zod(verifyOtpSchema), { id: 'verifyOtpForm' });
	const forgotPasswordForm = await superValidate(zod(forgotPasswordSchema), { id: 'forgotPasswordForm' });
	return { loginForm, signupForm, verifyOtpForm, forgotPasswordForm };
};

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginFormSchema), { id: 'loginForm' });
		if (!form.valid) return fail(422, { form });

		const { username, password } = form.data;

		try {
			const user = await getUserByUsername(username as string);
			if (!user) return message(form, STRINGS.AUTH.MESSAGES.INVALID_CREDENTIALS, { status: 401 });
			
			if (user.is_verified === 0) return message(form, 'Account is not verified. Please check your email for OTP.', { status: 401 });

			const isPasswordValid = await bcrypt.compare(password as string, user.password);
			if (!isPasswordValid)
				return message(form, STRINGS.AUTH.MESSAGES.INVALID_CREDENTIALS, { status: 401 });

			const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });

			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});
			
			if (user.role === 'admin') {
				throw redirect(303, '/admin');
			}
			throw redirect(303, '/client/shop');
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Login error:', error as Error);
			return message(form, STRINGS.AUTH.MESSAGES.DB_ERROR_LOGIN, { status: 500 });
		}
	},
	signup: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signupFormSchema), { id: 'signupForm' });
		if (!form.valid) return fail(422, { form });

		const { username, password, email } = form.data;
		const hashedPassword = await bcrypt.hash(password as string, 10);

		try {
			const result = await createUser(username as string, hashedPassword, email as string);
			const user = await getUserByUsername(username as string);
			
			if (result.isFirstUser) {
				// Bypass OTP for first user
				const payload = { id: user?.id, username, email, role: 'admin' };
				const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });

				cookies.set('authToken', token, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 60 * 60 * 24 // 1 day
				});
				throw redirect(303, '/admin');
			} else {
				// Require OTP
				const otp = Math.floor(100000 + Math.random() * 900000).toString();
				await setOTP(user!.id, otp);
				await sendOTP(email as string, otp);
				
				return message(form, { requiresOtp: true, userId: user!.id, email: email });
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
			const isValid = await verifyOTP(form.data.userId, form.data.otp);
			if (!isValid) return message(form, 'Invalid or expired OTP', { status: 400 });
			
			const user = await getUserById(form.data.userId);
			if (!user) return message(form, 'User not found', { status: 404 });

			const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });

			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});
			
			throw redirect(303, '/client/shop');
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('OTP error:', error as Error);
			return message(form, 'Failed to verify OTP', { status: 500 });
		}
	},
	forgotPassword: async ({ request }) => {
		const form = await superValidate(request, zod(forgotPasswordSchema), { id: 'forgotPasswordForm' });
		if (!form.valid) return fail(422, { form });
		
		try {
			const user = await getUserByEmail(form.data.email);
			if (user) {
				const token = crypto.randomBytes(32).toString('hex');
				await setResetToken(form.data.email, token);
				await sendResetPassword(form.data.email, token);
			}
			// Always return success to prevent email enumeration
			return message(form, 'If your email is registered, a reset link has been sent.');
		} catch (error) {
			logger.error('Forgot password error:', error as Error);
			return message(form, 'Failed to process request', { status: 500 });
		}
	}
};
