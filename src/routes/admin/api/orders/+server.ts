import type { RequestHandler } from '@sveltejs/kit';

import { HTTP_STATUS, ERROR_CODES, APP_CONFIG } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { checkAdmin } from '$lib/server/admin-guard.js';
import { getAllOrdersAdmin, updateOrderStatus } from '$lib/server/services/orderService.js';
const verifyAdmin = async (locals: App.Locals, request: Request) => {
	if (locals.user?.role !== 'admin' && !(await checkAdmin(request))) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}
	return null;
};

const mapOrderStatusError = (error: unknown) => {
	const err = error as { statusCode?: number; message?: string };
	const isConflict = err.statusCode === HTTP_STATUS.CONFLICT;
	return errorResponse(
		err.message || MESSAGES.ERROR.SERVER,
		isConflict ? HTTP_STATUS.CONFLICT : HTTP_STATUS.INTERNAL_SERVER_ERROR,
		isConflict ? ERROR_CODES.CONFLICT : ERROR_CODES.INTERNAL_ERROR
	);
};

export const GET: RequestHandler = async ({ request, url, locals }) => {
	const authErr = await verifyAdmin(locals, request);
	if (authErr) return authErr;

	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const limit = Number(url.searchParams.get('limit')) || APP_CONFIG.DEFAULT_PAGINATION_LIMIT;
		const result = await getAllOrdersAdmin(page, limit);
		return jsonResponse(result, MESSAGES.SUCCESS.FETCH);
	} catch (error) {
		return errorResponse(
			(error as Error).message,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	const authErr = await verifyAdmin(locals, request);
	if (authErr) return authErr;

	try {
		const { orderId, status } = await request.json();
		if (!orderId || !status) {
			return errorResponse(
				MESSAGES.ERROR.VALIDATION,
				HTTP_STATUS.BAD_REQUEST,
				ERROR_CODES.VALIDATION_ERROR
			);
		}
		await updateOrderStatus(orderId, status);
		return jsonResponse(null, MESSAGES.SUCCESS.UPDATE);
	} catch (error) {
		return mapOrderStatusError(error);
	}
};
