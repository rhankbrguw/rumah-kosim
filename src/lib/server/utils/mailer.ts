import { STRINGS } from '$lib/constants/strings.js';
import { CLIENT_ROUTES } from '$lib/constants/routes.js';
import { APP_CONFIG } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import {
	wrapEmailDocument,
	bodyTextStyles,
	buttonStyles,
	headingStyles,
	noteTextStyles,
	otpCodeStyles,
	panelStyles,
	subTextStyles
} from './emailStyles.js';
import { env } from '$env/dynamic/private';

function getSender() {
	const name =
		env.EMAIL_FROM_NAME ||
		env.RESEND_FROM_NAME ||
		process.env.EMAIL_FROM_NAME ||
		process.env.RESEND_FROM_NAME ||
		'Rumah Kosim';
	const from =
		env.EMAIL_FROM ||
		env.RESEND_FROM ||
		process.env.EMAIL_FROM ||
		process.env.RESEND_FROM ||
		'noreply@rhankbrguw.xyz';
	return `"${name}" <${from}>`;
}

function getAppBaseUrl() {
	const configured =
		env.APP_BASE_URL || env.APP_URL || process.env.APP_BASE_URL || process.env.APP_URL;
	if (configured && !configured.includes('localhost')) {
		return configured.replace(/\/$/, '');
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}
	return APP_CONFIG.PRODUCTION_URL;
}

const send = async (to: string, subject: string, html: string, text: string) => {
	const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
	if (!apiKey) {
		logger.warn('RESEND_API_KEY not configured. Email dispatch skipped.', { to, subject });
		return;
	}

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: getSender(),
				to: [to],
				subject,
				html,
				text
			})
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			logger.error('Failed to send email via Resend:', errorData);
		}
	} catch (err) {
		logger.error('Resend email network error:', err as Error);
	}
};

export const sendOTP = async (email: string, otp: string) => {
	const subject = 'Your Rumah-Kosim Verification Code';
	const html = wrapEmailDocument(
		STRINGS.AUTH.OTP.TITLE,
		`<h2 style="${headingStyles}">${STRINGS.AUTH.OTP.TITLE}</h2><p style="${bodyTextStyles}">Welcome to Rumah-Kosim! Please use the following One-Time Password to complete your registration.</p><div style="${otpCodeStyles}">${otp}</div><p style="${noteTextStyles}">This code will expire in <strong>5 minutes</strong>. Do not share this code with anyone.</p>`
	);
	const text = `Welcome to Rumah-Kosim!\n\nYour Verification Code: ${otp}\n\nThis code will expire in 5 minutes. Do not share this code with anyone.`;
	await send(email, subject, html, text);
};

export const sendResetPassword = async (email: string, token: string) => {
	const resetLink = `${getAppBaseUrl()}${CLIENT_ROUTES.RESET_PASSWORD}?token=${token}`;
	const html = wrapEmailDocument(
		STRINGS.AUTH.FORGOT_PASSWORD.TITLE,
		`<h2 style="${headingStyles}">${STRINGS.AUTH.FORGOT_PASSWORD.TITLE}</h2><p style="${bodyTextStyles}">We received a request to reset your password for your Rumah-Kosim account. Click the button below to set a new password.</p><a href="${resetLink}" style="${buttonStyles}">${STRINGS.AUTH.FORGOT_PASSWORD.SUBMIT}</a><p style="${noteTextStyles}">If you didn't request this, you can safely ignore this email. The link will expire in 5 minutes.</p>`
	);
	const text = `We received a request to reset your password for your Rumah-Kosim account.\n\nReset Password Link:\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email. The link will expire in 5 minutes.`;
	await send(email, STRINGS.AUTH.FORGOT_PASSWORD.TITLE, html, text);
};

export const sendOrderConfirmationEmail = async (
	email: string,
	total: number,
	trackingNumber: string
) => {
	const historyLink = `${getAppBaseUrl()}${CLIENT_ROUTES.HISTORY}`;
	const formattedTotal = `Rp ${total.toLocaleString('id-ID')}`;
	const html = wrapEmailDocument(
		STRINGS.EMAIL.INVOICE.TITLE,
		`<h2 style="${headingStyles}">${STRINGS.EMAIL.INVOICE.TITLE}</h2><p style="${bodyTextStyles}">${STRINGS.EMAIL.INVOICE.GREETING} ${STRINGS.EMAIL.INVOICE.MESSAGE}</p><div style="${panelStyles}">${STRINGS.EMAIL.INVOICE.TOTAL} ${formattedTotal}<span style="${subTextStyles}">${STRINGS.EMAIL.INVOICE.TRACKING} ${trackingNumber}</span></div><a href="${historyLink}" style="${buttonStyles}">${STRINGS.EMAIL.INVOICE.BUTTON}</a>`
	);
	const text = `${STRINGS.EMAIL.INVOICE.GREETING}\n${STRINGS.EMAIL.INVOICE.MESSAGE}\n\n${STRINGS.EMAIL.INVOICE.TOTAL} ${formattedTotal}\n${STRINGS.EMAIL.INVOICE.TRACKING} ${trackingNumber}\n\nView your orders: ${historyLink}`;
	await send(email, STRINGS.EMAIL.INVOICE.SUBJECT, html, text);
};

export const sendStatusUpdateEmail = async (
	email: string,
	status: string,
	trackingNumber: string
) => {
	const historyLink = `${getAppBaseUrl()}${CLIENT_ROUTES.HISTORY}`;
	const html = wrapEmailDocument(
		STRINGS.EMAIL.SHIPPING.TITLE,
		`<h2 style="${headingStyles}">${STRINGS.EMAIL.SHIPPING.TITLE}</h2><p style="${bodyTextStyles}">${STRINGS.EMAIL.SHIPPING.GREETING} ${STRINGS.EMAIL.SHIPPING.MESSAGE}</p><div style="${panelStyles}">${status}<span style="${subTextStyles}">${STRINGS.EMAIL.SHIPPING.TRACKING} ${trackingNumber}</span></div><a href="${historyLink}" style="${buttonStyles}">${STRINGS.EMAIL.SHIPPING.BUTTON}</a>`
	);
	const text = `${STRINGS.EMAIL.SHIPPING.GREETING}\n${STRINGS.EMAIL.SHIPPING.MESSAGE} ${status}\n${STRINGS.EMAIL.SHIPPING.TRACKING} ${trackingNumber}\n\nTrack order: ${historyLink}`;
	await send(email, STRINGS.EMAIL.SHIPPING.SUBJECT, html, text);
};

export const sendAdminNotificationEmail = async (
	adminEmails: string[],
	orderId: number,
	total: number,
	username: string
) => {
	const adminLink = `${getAppBaseUrl()}${CLIENT_ROUTES.ADMIN}`;
	const formattedTotal = `Rp ${total.toLocaleString('id-ID')}`;
	const html = wrapEmailDocument(
		STRINGS.EMAIL.ADMIN.TITLE,
		`<h2 style="${headingStyles}">${STRINGS.EMAIL.ADMIN.TITLE}</h2><p style="${bodyTextStyles}">${STRINGS.EMAIL.ADMIN.MESSAGE} <strong>${username}</strong>.</p><div style="${panelStyles}">Order #${orderId}<span style="${subTextStyles}">Total: ${formattedTotal}</span></div><a href="${adminLink}" style="${buttonStyles}">${STRINGS.EMAIL.ADMIN.BUTTON}</a>`
	);
	const text = `New order alert!\n\nOrder #${orderId}\nCustomer: ${username}\nTotal: ${formattedTotal}\n\nAdmin Dashboard: ${adminLink}`;
	const promises = adminEmails.map((email) => send(email, STRINGS.EMAIL.ADMIN.SUBJECT, html, text));
	await Promise.allSettled(promises);
};
