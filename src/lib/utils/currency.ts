import { FORMAT } from '$lib/constants/config.js';

/**
 * Format number to Indonesian Rupiah
 * @param {number} number
 * @returns {string} Formatted IDR string
 */
export function formatIDR(number: number) {
	return new Intl.NumberFormat(FORMAT.LOCALE, {
		style: 'currency',
		currency: FORMAT.CURRENCY_CODE,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(number);
}
