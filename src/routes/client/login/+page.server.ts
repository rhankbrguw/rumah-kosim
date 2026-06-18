import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { APP_CONFIG } from '$lib/constants/config.js';
import { getUserByUsername } from '$lib/server/services/authService.js';
import { fail, redirect } from '@sveltejs/kit';

const loginFormSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required')
});

export const load = async () => {
	const form = await superValidate(zod(loginFormSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(loginFormSchema));
		if (!form.valid) return fail(400, { form });

		const { username, password } = form.data;

		try {
			const user = await getUserByUsername(username as string);
			if (!user) return message(form, 'Invalid username or password', { status: 401 });

			const isPasswordValid = await bcrypt.compare(password as string, user.password);
			if (!isPasswordValid) return message(form, 'Invalid username or password', { status: 401 });

			const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });

			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});
		} catch (error) {
			return message(form, 'Database error during login', { status: 500 });
		}

		throw redirect(303, '/client/shop');
	}
};
