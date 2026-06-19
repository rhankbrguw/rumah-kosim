import { COLORS } from '$lib/constants/colors.js';

export const baseStyles = `
	font-family: 'Inter', system-ui, -apple-system, sans-serif;
	background-color: ${COLORS.SURFACE_ALT};
	color: ${COLORS.TEXT_MAIN};
	padding: 40px 20px;
	text-align: center;
`;

export const containerStyles = `
	background-color: ${COLORS.SURFACE};
	max-width: 500px;
	margin: 0 auto;
	border-radius: 16px;
	padding: 40px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	border: 1px solid rgba(15, 23, 42, 0.1);
`;

export const headingStyles = `
	font-family: 'Playfair Display', serif;
	color: ${COLORS.TEXT_MAIN};
	font-size: 24px;
	margin-bottom: 20px;
`;

export const buttonStyles = `
	display: inline-block;
	background-color: ${COLORS.PRIMARY};
	color: ${COLORS.TEXT_MAIN};
	font-weight: bold;
	text-decoration: none;
	padding: 14px 28px;
	border-radius: 8px;
	margin-top: 20px;
	font-size: 16px;
`;
