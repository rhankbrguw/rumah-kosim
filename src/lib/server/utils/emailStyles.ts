import { DESIGN_TOKENS } from '$lib/constants/tokens.js';

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

export const panelStyles = `font-size:20px;font-weight:700;color:${DESIGN_TOKENS.color.text.primary};background-color:${DESIGN_TOKENS.color.surface.alt};padding:18px 24px;border-radius:12px;margin:16px 0;text-align:center;`;

export const buttonStyles = `display:inline-block;background-color:${DESIGN_TOKENS.color.brand.primary};color:${DESIGN_TOKENS.color.text.primary};font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:8px;margin-top:16px;`;

export const subTextStyles = `font-size:14px;font-weight:400;color:${DESIGN_TOKENS.color.text.muted};display:block;margin-top:6px;`;
