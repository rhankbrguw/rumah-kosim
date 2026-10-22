import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';
import {
	strictEmailSchema,
	strictNameSchema,
	strictPhoneSchema,
	strictUsernameSchema
} from '$lib/utils/validators.js';

export const loginSchema = z.object({
	username: z.string().trim().min(1, MESSAGES.VALIDATION.USERNAME_REQUIRED),
	password: z.string().min(1, MESSAGES.VALIDATION.PASSWORD_REQUIRED)
});

export const registerSchema = z.object({
	username: strictUsernameSchema,
	password: z.string().min(6, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH),
	email: strictEmailSchema
});

export const validateTokenSchema = z.object({
	token: z.string().min(1, MESSAGES.VALIDATION.TOKEN_REQUIRED)
});

export const profileSchema = z.object({
	username: strictUsernameSchema,
	email: strictEmailSchema,
	full_name: strictNameSchema.nullable().optional().or(z.literal('')),
	phone: strictPhoneSchema.nullable().optional().or(z.literal('')),
	address: z.string().max(500).nullable().optional(),
	password: z.string().min(6, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH).or(z.literal('')).optional()
});
