import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { jsonResponse, errorResponse } from '$lib/server/utils/response.js';
import { MESSAGES } from '$lib/constants/messages.js';
import { checkAdmin } from '$lib/server/admin-guard.js';
import { getAllOrdersAdmin, updateOrderStatus } from '$lib/server/services/orderService.js';
export async function GET({ request }) {
	if (!(await checkAdmin(request))) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

	try {
		const orders = await getAllOrdersAdmin();
		return jsonResponse({ orders }, MESSAGES.SUCCESS.FETCH);
	} catch (error) {
		return errorResponse(
			(error as Error).message,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}

export async function PATCH({ request }) {
	if (!(await checkAdmin(request))) {
		return errorResponse(
			MESSAGES.ERROR.UNAUTHORIZED,
			HTTP_STATUS.UNAUTHORIZED,
			ERROR_CODES.UNAUTHORIZED
		);
	}

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
		return errorResponse(
			(error as Error).message,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
}
