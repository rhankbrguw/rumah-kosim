import { json } from '@sveltejs/kit';
import { ERROR_CODES } from '$lib/constants/config.js';

/**
 * Standardize API success responses
 * @param {any} data - The payload data
 * @param {string} message - Success message
 * @param {number} status - HTTP status code
 * @param {string} code - Domain specific success code
 * @returns {Response}
 */
export const jsonResponse = (
	data: unknown = null,
	message: string = 'Success',
	status: number = 200,
	code: string = ERROR_CODES.SUCCESS
) => {
	return json(
		{
			success: true,
			code,
			message,
			data,
			meta: {
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID()
			}
		},
		{ status }
	);
};

/**
 * Standardize API error responses
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {string} code - Domain specific error code
 * @param {any} errors - Additional error details (e.g., Zod issues)
 * @returns {Response}
 */
export const errorResponse = (
	message: string = 'Internal Server Error',
	status: number = 500,
	code: string = ERROR_CODES.INTERNAL_ERROR,
	errors: unknown = null
) => {
	return json(
		{
			success: false,
			code,
			message,
			errors,
			meta: {
				timestamp: new Date().toISOString(),
				request_id: crypto.randomUUID()
			}
		},
		{ status }
	);
};
