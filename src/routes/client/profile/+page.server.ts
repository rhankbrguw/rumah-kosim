import type { RequestEvent } from '@sveltejs/kit';

import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { profileSchema } from '$lib/server/validations/auth.js';
import { getUserById } from '$lib/server/services/authService.js';
import { getUserAddresses } from '$lib/server/services/profileService.js';
import { redirect, fail } from '@sveltejs/kit';

import { handleProfileUpdate } from '$lib/services/authHelper.server.js';
import { AUTH_COOKIE_OPTIONS } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) {
		throw redirect(302, '/client/auth');
	}

	const user = await getUserById(locals.user.id);
	if (!user) throw redirect(302, '/client/auth');

	let cleanPhone = user.phone || '';
	if (cleanPhone) {
		cleanPhone = cleanPhone.replace(/\D/g, '');
		if (cleanPhone.startsWith('62')) cleanPhone = cleanPhone.substring(2);
		else if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
	}

	const form = await superValidate(
		{
			username: user.username,
			email: user.email,
			full_name: user.full_name || '',
			phone: cleanPhone,
			address: user.address || ''
		},
		zod(profileSchema)
	);

	const userAddresses = await getUserAddresses(locals.user.id);

	return { form, avatar: user.avatar, userAddresses };
};

export const actions = {
	default: async ({ request, locals, cookies }: RequestEvent) => {
		if (!locals.user) throw redirect(302, '/client/auth');

		const formData = await request.formData();
		const form = await superValidate(formData, zod(profileSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const token = await handleProfileUpdate(
				locals.user.id,
				formData,
				locals.user.avatar || '',
				locals.user.role
			);

			cookies.set('authToken', token, AUTH_COOKIE_OPTIONS);

			return { form, success: true };
		} catch (_error) {
			logger.error('Failed to update profile:', _error as Error);
			return message(form, 'Failed to update profile', { status: 500 });
		}
	}
};
