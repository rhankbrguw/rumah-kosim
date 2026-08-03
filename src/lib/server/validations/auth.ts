import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';

export const loginSchema = z.object({
	username: z.string().min(1, MESSAGES.VALIDATION.USERNAME_REQUIRED),
	password: z.string().min(1, MESSAGES.VALIDATION.PASSWORD_REQUIRED)
});

export const registerSchema = z.object({
	username: z.string().min(1, MESSAGES.VALIDATION.USERNAME_REQUIRED),
	password: z.string().min(6, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
	email: z
		.string()
		.email(MESSAGES.VALIDATION.EMAIL_INVALID)
		.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, MESSAGES.VALIDATION.EMAIL_FORMAT)
});

export const validateTokenSchema = z.object({
	token: z.string().min(1, MESSAGES.VALIDATION.TOKEN_REQUIRED)
});

export const profileSchema = z.object({
	username: z.string().min(1, MESSAGES.VALIDATION.USERNAME_REQUIRED),
	email: z.string().email(MESSAGES.VALIDATION.EMAIL_INVALID),
	full_name: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	password: z.string().min(6, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH).or(z.literal('')).optional()
});
