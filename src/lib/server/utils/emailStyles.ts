import { DESIGN_TOKENS } from '$lib/constants/tokens.js';
import { STRINGS } from '$lib/constants/strings.js';
import { APP_CONFIG } from '$lib/constants/config.js';
import { formatIDR } from '$lib/utils/currency.js';
import { env } from '$env/dynamic/private';

export function getSender(): string {
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

export function getAppBaseUrl(): string {
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

export interface EmailOrderItem {
	title: string;
	quantity: number;
	price: number;
}

export function wrapEmailDocument(title: string, contentHtml: string): string {
	const bgOuter = DESIGN_TOKENS.color.surface.secondary;
	const bgCard = DESIGN_TOKENS.color.surface.primary;
	const borderColor = DESIGN_TOKENS.color.border.subtle;
	const fontStack = DESIGN_TOKENS.font.body;

	return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head><body style="margin:0;padding:0;background-color:${bgOuter};font-family:${fontStack};"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:${bgOuter};padding:32px 16px;"><tr><td align="center"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:540px;background-color:${bgCard};border-radius:16px;border:1px solid ${borderColor};padding:36px 28px;text-align:center;"><tr><td>${contentHtml}</td></tr></table></td></tr></table></body></html>`.trim();
}

export const headingStyles = `font-family:${DESIGN_TOKENS.font.display};color:${DESIGN_TOKENS.color.text.primary};font-size:24px;font-weight:700;margin:0 0 16px 0;`;

export const bodyTextStyles = `font-size:15px;line-height:1.6;color:${DESIGN_TOKENS.color.text.muted};margin:0 0 20px 0;`;

export const noteTextStyles = `font-size:13px;line-height:1.5;color:${DESIGN_TOKENS.color.text.muted};margin:20px 0 0 0;`;

export const otpCodeStyles = `display:inline-block;font-size:32px;font-weight:800;letter-spacing:6px;color:${DESIGN_TOKENS.color.text.primary};background-color:${DESIGN_TOKENS.color.surface.alt};padding:18px 32px;border-radius:12px;border:1px dashed ${DESIGN_TOKENS.color.border.strong};margin:16px 0;`;

export const panelStyles = `font-size:18px;font-weight:700;color:${DESIGN_TOKENS.color.text.primary};background-color:${DESIGN_TOKENS.color.surface.alt};padding:16px 20px;border-radius:12px;margin:16px 0;text-align:center;`;

export const buttonStyles = `display:inline-block;background-color:${DESIGN_TOKENS.color.brand.primary};color:${DESIGN_TOKENS.color.text.primary};font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;margin-top:16px;`;

export const subTextStyles = `font-size:14px;font-weight:400;color:${DESIGN_TOKENS.color.text.muted};display:block;margin-top:6px;`;

export function renderEmailItemsTable(items: EmailOrderItem[]): string {
	if (!items || items.length === 0) return '';

	const border = DESIGN_TOKENS.color.border.subtle;
	const textMain = DESIGN_TOKENS.color.text.primary;
	const textMuted = DESIGN_TOKENS.color.text.muted;
	const bgAlt = DESIGN_TOKENS.color.surface.alt;

	const rows = items
		.map(
			(i) =>
				`<tr style="border-bottom:1px solid ${border};"><td style="padding:10px 8px;font-size:13px;color:${textMain};font-weight:600;text-align:left;">${
					i.title
				}</td><td style="padding:10px 8px;font-size:13px;color:${textMuted};text-align:center;">${
					i.quantity
				}</td><td style="padding:10px 8px;font-size:13px;color:${textMuted};text-align:right;">${formatIDR(
					i.price
				)}</td><td style="padding:10px 8px;font-size:13px;color:${textMain};font-weight:700;text-align:right;">${formatIDR(
					i.price * i.quantity
				)}</td></tr>`
		)
		.join('');

	return `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;margin:16px 0;border-collapse:collapse;background-color:${bgAlt};border-radius:10px;overflow:hidden;"><thead><tr style="border-bottom:1px solid ${border};"><th style="padding:10px 8px;font-size:11px;text-transform:uppercase;color:${textMuted};text-align:left;">${STRINGS.EMAIL.TABLE.HEADER_TITLE}</th><th style="padding:10px 8px;font-size:11px;text-transform:uppercase;color:${textMuted};text-align:center;">${STRINGS.EMAIL.TABLE.HEADER_QTY}</th><th style="padding:10px 8px;font-size:11px;text-transform:uppercase;color:${textMuted};text-align:right;">${STRINGS.EMAIL.TABLE.HEADER_PRICE}</th><th style="padding:10px 8px;font-size:11px;text-transform:uppercase;color:${textMuted};text-align:right;">${STRINGS.EMAIL.TABLE.HEADER_SUBTOTAL}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function renderEmailItemsText(items: EmailOrderItem[]): string {
	if (!items || items.length === 0) return '';
	const lines = items.map(
		(i) =>
			`• ${i.title} (${i.quantity}x ${formatIDR(i.price)}) = ${formatIDR(i.price * i.quantity)}`
	);
	return `${STRINGS.EMAIL.TABLE.ITEMS_TITLE}\n${lines.join('\n')}`;
}
