import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';
import { strictEmailSchema, strictUsernameSchema } from '$lib/utils/validators.js';

export const loginFormSchema = z.object({
	username: z.string().trim().min(1, MESSAGES.VALIDATION.USERNAME_REQUIRED),
	password: z.string().min(1, MESSAGES.VALIDATION.PASSWORD_REQUIRED)
});

export const signupFormSchema = z
	.object({
		username: strictUsernameSchema,
		email: strictEmailSchema,
		password: z.string().min(6, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: MESSAGES.VALIDATION.CONFIRM_PASSWORD_MISMATCH,
		path: ['confirmPassword']
	});

export const verifyOtpSchema = z.object({
	userId: z.coerce.number(),
	otp: z.string().length(6, MESSAGES.VALIDATION.TOKEN_REQUIRED)
});

export const forgotPasswordSchema = z.object({
	email: strictEmailSchema
});
