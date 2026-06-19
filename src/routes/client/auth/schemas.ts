import { z } from 'zod';

export const loginFormSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required')
});

export const signupFormSchema = z
	.object({
		username: z.string().min(3, 'Username must be at least 3 characters'),
		email: z.string()
			.email('Invalid email address')
			.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid industry-standard email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export const verifyOtpSchema = z.object({
	userId: z.coerce.number(),
	otp: z.string().length(6, 'OTP must be 6 digits')
});

export const forgotPasswordSchema = z.object({
	email: z.string()
		.email('Invalid email address')
		.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid industry-standard email address')
});
