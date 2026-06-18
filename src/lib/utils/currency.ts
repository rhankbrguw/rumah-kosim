/**
 * Format number to Indonesian Rupiah
 * @param {number} number
 * @returns {string} Formatted IDR string
 */
export function formatIDR(number: number) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(number);
}
