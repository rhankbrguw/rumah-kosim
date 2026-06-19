import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required')
});

export const registerSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	email: z.string()
		.email('Invalid email address')
		.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid industry-standard email address')
});

export const validateTokenSchema = z.object({
	token: z.string().min(1, 'Token is required')
});
