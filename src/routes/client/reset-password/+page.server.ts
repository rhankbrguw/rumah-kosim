import type { RequestEvent } from '@sveltejs/kit';

import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail, redirect, isRedirect } from '@sveltejs/kit';

import { handleResetPassword } from '$lib/services/authHelper.server.js';
import { logger } from '$lib/server/utils/logger.js';
import { HTTP_STATUS } from '$lib/constants/config.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';
import { STRINGS } from '$lib/constants/strings.js';

const resetPasswordSchema = z
	.object({
		token: z.string().min(1, STRINGS.RESET_PASSWORD.MESSAGES.TOKEN_MISSING),
		password: z.string().min(6, STRINGS.RESET_PASSWORD.MESSAGES.PASSWORD_MIN),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: STRINGS.RESET_PASSWORD.MESSAGES.PASSWORD_MISMATCH,
		path: ['confirmPassword']
	});

export const load = async ({ url }: RequestEvent) => {
	const token = url.searchParams.get('token') || '';

	const form = await superValidate(zod(resetPasswordSchema));
	form.data.token = token;

	return { form, token };
};

export const actions = {
	default: async ({ request }: RequestEvent) => {
		const form = await superValidate(request, zod(resetPasswordSchema));
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });

		try {
			const result = await handleResetPassword(form.data.token, form.data.password);

			if (!result.success) {
				return message(form, result.error as string, { status: result.status as 400 | 500 });
			}

			throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.AUTH);
		} catch (error) {
			if (isRedirect(error)) throw error;
			logger.error('Reset password error:', error as Error);
			return message(form, STRINGS.RESET_PASSWORD.MESSAGES.FAILED, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	}
};
