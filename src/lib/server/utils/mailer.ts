import nodemailer from 'nodemailer';
import { COLORS } from '$lib/constants/colors.js';
import { STRINGS } from '$lib/constants/strings.js';
import { baseStyles, containerStyles, headingStyles, buttonStyles } from './emailStyles.js';

import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, SMTP_FROM, SMTP_FROM_NAME } from '$env/static/private';

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: Number(SMTP_PORT),
	secure: SMTP_SECURE === 'true' || SMTP_SECURE === 'ssl',
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS
	}
});

const SENDER = `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`;

const send = (to: string, subject: string, html: string) => transporter.sendMail({ from: SENDER, to, subject, html });

export const sendOTP = async (email: string, otp: string) => {
	const html = `
		<div style="${baseStyles}"><div style="${containerStyles}">
			<h2 style="${headingStyles}">${STRINGS.AUTH.OTP.TITLE}</h2>
			<p style="font-size: 16px; line-height: 1.5; color: ${COLORS.TEXT_MUTED};">Welcome to Rumah-Kosim! Please use the following One-Time Password to complete your registration.</p>
			<div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: ${COLORS.TEXT_MAIN}; background: ${COLORS.SURFACE_ALT}; padding: 20px; border-radius: 12px; margin: 30px 0;">${otp}</div>
			<p style="font-size: 14px; color: ${COLORS.TEXT_MUTED};">This code will expire in <strong>5 minutes</strong>. Do not share this code with anyone.</p>
		</div></div>
	`;
	await send(email, 'Your Rumah-Kosim Verification Code', html);
};

export const sendResetPassword = async (email: string, token: string) => {
	const resetLink = `http://localhost:5173/client/reset-password?token=${token}`;
	const html = `
		<div style="${baseStyles}"><div style="${containerStyles}">
			<h2 style="${headingStyles}">${STRINGS.AUTH.FORGOT_PASSWORD.TITLE}</h2>
			<p style="font-size: 16px; line-height: 1.5; color: ${COLORS.TEXT_MUTED};">We received a request to reset your password for your Rumah-Kosim account. Click the button below to set a new password.</p>
			<a href="${resetLink}" style="${buttonStyles}">${STRINGS.AUTH.FORGOT_PASSWORD.SUBMIT}</a>
			<p style="font-size: 14px; color: ${COLORS.TEXT_MUTED}; margin-top: 30px;">If you didn't request this, you can safely ignore this email. The link will expire in 5 minutes.</p>
		</div></div>
	`;
	await send(email, STRINGS.AUTH.FORGOT_PASSWORD.TITLE, html);
};

export const sendOrderConfirmationEmail = async (email: string, total: number, trackingNumber: string) => {
	const historyLink = `http://localhost:5173/client/profile`;
	const html = `
		<div style="${baseStyles}"><div style="${containerStyles}">
			<h2 style="${headingStyles}">${STRINGS.EMAIL.INVOICE.TITLE}</h2>
			<p style="font-size: 16px; line-height: 1.5; color: ${COLORS.TEXT_MUTED};">${STRINGS.EMAIL.INVOICE.GREETING} ${STRINGS.EMAIL.INVOICE.MESSAGE}</p>
			<div style="font-size: 24px; font-weight: bold; color: ${COLORS.TEXT_MAIN}; background: ${COLORS.SURFACE_ALT}; padding: 20px; border-radius: 12px; margin: 30px 0;">
				${STRINGS.EMAIL.INVOICE.TOTAL} Rp ${total.toLocaleString('id-ID')}<br><br>
				<span style="font-size: 16px; font-weight: normal;">${STRINGS.EMAIL.INVOICE.TRACKING} ${trackingNumber}</span>
			</div>
			<a href="${historyLink}" style="${buttonStyles}">${STRINGS.EMAIL.INVOICE.BUTTON}</a>
		</div></div>
	`;
	await send(email, STRINGS.EMAIL.INVOICE.SUBJECT, html);
};

export const sendStatusUpdateEmail = async (email: string, status: string, trackingNumber: string) => {
	const historyLink = `http://localhost:5173/client/profile`;
	const html = `
		<div style="${baseStyles}"><div style="${containerStyles}">
			<h2 style="${headingStyles}">${STRINGS.EMAIL.SHIPPING.TITLE}</h2>
			<p style="font-size: 16px; line-height: 1.5; color: ${COLORS.TEXT_MUTED};">${STRINGS.EMAIL.SHIPPING.GREETING} ${STRINGS.EMAIL.SHIPPING.MESSAGE}</p>
			<div style="font-size: 28px; font-weight: bold; text-transform: uppercase; color: ${COLORS.TEXT_MAIN}; background: ${COLORS.SURFACE_ALT}; padding: 20px; border-radius: 12px; margin: 30px 0;">
				${status}<br><br>
				<span style="font-size: 16px; font-weight: normal; text-transform: none;">${STRINGS.EMAIL.SHIPPING.TRACKING} ${trackingNumber}</span>
			</div>
			<a href="${historyLink}" style="${buttonStyles}">${STRINGS.EMAIL.SHIPPING.BUTTON}</a>
		</div></div>
	`;
	await send(email, STRINGS.EMAIL.SHIPPING.SUBJECT, html);
};

export const sendAdminNotificationEmail = async (adminEmails: string[], orderId: number, total: number, username: string) => {
	const adminLink = `http://localhost:5173/admin`;
	const html = `
		<div style="${baseStyles}"><div style="${containerStyles}">
			<h2 style="${headingStyles}">${STRINGS.EMAIL.ADMIN.TITLE}</h2>
			<p style="font-size: 16px; line-height: 1.5; color: ${COLORS.TEXT_MUTED};">${STRINGS.EMAIL.ADMIN.MESSAGE} <strong>${username}</strong>.</p>
			<div style="font-size: 24px; font-weight: bold; color: ${COLORS.TEXT_MAIN}; background: ${COLORS.SURFACE_ALT}; padding: 20px; border-radius: 12px; margin: 30px 0;">
				Order #${orderId}<br><br>
				<span style="font-size: 16px; font-weight: normal;">Total: Rp ${total.toLocaleString('id-ID')}</span>
			</div>
			<a href="${adminLink}" style="${buttonStyles}">${STRINGS.EMAIL.ADMIN.BUTTON}</a>
		</div></div>
	`;
	

	const promises = adminEmails.map((email) => send(email, STRINGS.EMAIL.ADMIN.SUBJECT, html));
	await Promise.allSettled(promises);
};
