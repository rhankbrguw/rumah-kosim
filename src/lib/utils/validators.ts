import { z } from 'zod';
import { MESSAGES } from '$lib/constants/messages.js';

const ALLOWED_EMAIL_DOMAINS = new Set([
	'gmail.com',
	'googlemail.com',
	'outlook.com',
	'outlook.co.id',
	'hotmail.com',
	'hotmail.co.id',
	'live.com',
	'live.co.id',
	'msn.com',
	'yahoo.com',
	'yahoo.co.id',
	'yahoo.co.uk',
	'ymail.com',
	'rocketmail.com',
	'icloud.com',
	'me.com',
	'mac.com',
	'proton.me',
	'protonmail.com',
	'zoho.com',
	'mail.com',
	'yandex.com',
	'aol.com',
	'gmx.com',
	'gmx.net',
	'tutanota.com',
	'tutamail.com'
]);

export const strictEmailSchema = z
	.string()
	.trim()
	.min(1, MESSAGES.VALIDATION.EMAIL_INVALID)
	.max(254, MESSAGES.VALIDATION.EMAIL_INVALID)
	.regex(
		/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
		MESSAGES.VALIDATION.EMAIL_FORMAT
	)
	.refine(
		(email) => {
			const domain = email.split('@')[1]?.toLowerCase().trim();
			return !!domain && ALLOWED_EMAIL_DOMAINS.has(domain);
		},
		{ message: MESSAGES.VALIDATION.EMAIL_PROVIDER_INVALID }
	);

export const strictNameSchema = z
	.string()
	.trim()
	.min(2, MESSAGES.VALIDATION.FULL_NAME_MIN_LENGTH)
	.max(100, MESSAGES.VALIDATION.FULL_NAME_INVALID)
	.regex(/^[a-zA-Z\s'.,-]+$/, MESSAGES.VALIDATION.FULL_NAME_INVALID);

export const strictPhoneSchema = z
	.string()
	.trim()
	.regex(/^[0-9]{8,15}$/, MESSAGES.VALIDATION.PHONE_INVALID);

export const strictUsernameSchema = z
	.string()
	.trim()
	.min(3, MESSAGES.VALIDATION.USERNAME_REQUIRED)
	.max(30, MESSAGES.VALIDATION.USERNAME_FORMAT)
	.regex(/^[a-zA-Z0-9][a-zA-Z0-9_.-]*[a-zA-Z0-9]$/, MESSAGES.VALIDATION.USERNAME_FORMAT);
