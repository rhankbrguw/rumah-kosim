import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(303, '/');
	}
	return {};
};
