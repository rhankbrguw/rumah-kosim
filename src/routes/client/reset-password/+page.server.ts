import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { handleResetPassword } from '$lib/services/authHelper.server.js';
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
			const result = await handleResetPassword(form.data.token, form.data.password);

			if (!result.success) {
				return message(form, result.error as string, { status: result.status as 400 | 500 });
			}

			throw redirect(303, '/client/auth');
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Reset password error:', error as Error);
			return message(form, 'Failed to reset password', { status: 500 });
		}
	}
};
