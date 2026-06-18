import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { APP_CONFIG } from '$lib/constants/config.js';
import { createUser } from '$lib/server/services/authService.js';
import { fail, redirect } from '@sveltejs/kit';

const signupFormSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ['confirmPassword']
});

export const load = async () => {
	const form = await superValidate(zod(signupFormSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signupFormSchema));
		if (!form.valid) return fail(400, { form });

		const { username, password, email } = form.data;
		const hashedPassword = await bcrypt.hash(password as string, 10);

		try {
			await createUser(username as string, hashedPassword, email as string);

			const payload = { username, email, role: 'user' };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });

			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});
		} catch (error) {
			if ((error as {code?: string}).code === 'ER_DUP_ENTRY') {
				return message(form, 'Username or email already exists', { status: 409 });
			}
			return message(form, 'Database error during registration', { status: 500 });
		}

		throw redirect(303, '/client/shop');
	}
};
