import { json } from '@sveltejs/kit';
import { query } from '$lib/db.js';
import { HTTP_STATUS } from '$lib/constants/config.js';
import { logger } from '$lib/server/utils/logger.js';
import { checkAdmin } from '$lib/server/admin-guard.js';

export async function PATCH({ request }) {
	if (!(await checkAdmin(request))) {
		return json({ success: false, message: 'Unauthorized' }, { status: HTTP_STATUS.UNAUTHORIZED });
	}

	try {
		const { productId, quantity } = await request.json();

		if (!productId || quantity === undefined) {
			return json(
				{ success: false, message: 'Missing required fields' },
				{ status: HTTP_STATUS.BAD_REQUEST }
			);
		}

		await query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, productId]);

		return json({ success: true });
	} catch (error) {
		logger.error('Stock update error:', error as Error);
		return json(
			{ success: false, message: (error as Error).message },
			{ status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
		);
	}
}
