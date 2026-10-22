import type { RequestEvent } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';
import { HTTP_STATUS } from '$lib/constants/config.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(HTTP_STATUS.SEE_OTHER, CLIENT_ROUTES.HOME);
	}
	return {};
};
