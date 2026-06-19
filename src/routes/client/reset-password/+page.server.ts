import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { resetPassword, getUserByResetToken } from '$lib/server/services/authService.js';
import bcrypt from 'bcrypt';
import { logger } from '$lib/server/utils/logger.js';

const resetPasswordSchema = z
	.object({
		token: z.string().min(1, 'Token is missing'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export const load = async ({ url }) => {
	const token = url.searchParams.get('token') || '';
	
	const form = await superValidate(zod(resetPasswordSchema));
	form.data.token = token;
	
	return { form, token };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(resetPasswordSchema));
		if (!form.valid) return fail(422, { form });

		try {
			const user = await getUserByResetToken(form.data.token);
			if (!user || new Date() > new Date(user.reset_expires_at)) {
				return message(form, 'Invalid or expired token', { status: 400 });
			}

			const isSamePassword = await bcrypt.compare(form.data.password, user.password);
			if (isSamePassword) {
				return message(form, 'New password cannot be the same as your old password', { status: 400 });
			}

			const hashedPassword = await bcrypt.hash(form.data.password, 10);
			const success = await resetPassword(form.data.token, hashedPassword);
			
			if (!success) {
				return message(form, 'Invalid or expired token', { status: 400 });
			}
			
			throw redirect(303, '/client/auth');
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Reset password error:', error as Error);
			return message(form, 'Failed to reset password', { status: 500 });
		}
	}
};
