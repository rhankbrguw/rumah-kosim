import { ProductService } from '$lib/server/services/productService.js';
import { getAllOrdersAdmin, updateOrderStatus } from '$lib/server/services/orderService.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/utils/logger.js';
import { STRINGS } from '$lib/constants/strings.js';
import { APP_CONFIG, HTTP_STATUS } from '$lib/constants/config.js';
import type { Order } from '$lib/types';

import {
	adminProductSchema as productSchema,
	adminEditProductSchema as editProductSchema,
	adminOrderStatusSchema as orderStatusSchema,
	adminDeleteSchema as deleteSchema
} from '$lib/server/validations/admin.js';

const initAdminForms = async () => ({
	productForm: await superValidate(zod(productSchema)),
	editProductForm: await superValidate(zod(editProductSchema)),
	orderStatusForm: await superValidate(zod(orderStatusSchema)),
	deleteForm: await superValidate(zod(deleteSchema))
});

const emptyAdminData = async () => ({
	products: { data: [], total: 0 },
	orders: { data: [], total: 0 },
	...(await initAdminForms()),
	productPage: 1,
	orderPage: 1,
	search: undefined,
	limit: APP_CONFIG.DEFAULT_PAGINATION_LIMIT
});

export const load = async ({ url }: RequestEvent) => {
	try {
		const productPage = Number(url.searchParams.get('productPage')) || 1;
		const orderPage = Number(url.searchParams.get('orderPage')) || 1;
		const search = url.searchParams.get('search') || undefined;
		const limit = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;

		const [productsRaw, ordersRaw, forms] = await Promise.all([
			ProductService.getAll(productPage, limit, search),
			getAllOrdersAdmin(orderPage, limit),
			initAdminForms()
		]);

		return {
			products: productsRaw as unknown as {
				data: { id: number; title: string; price: number; quantity: number; image: string }[];
				total: number;
			},
			orders: ordersRaw as unknown as { data: Order[]; total: number },
			...forms,
			productPage,
			orderPage,
			search,
			limit
		};
	} catch (error) {
		logger.error('Failed to load admin data:', error as Error);
		return await emptyAdminData();
	}
};

const ensureAdmin = (locals: App.Locals) => locals.user?.role === 'admin';

export const actions = {
	addProduct: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals))
			return fail(HTTP_STATUS.FORBIDDEN, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(productSchema));
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });
		try {
			const { title, price, image, description, quantity } = form.data;
			await ProductService.create(title, price, image, description, quantity);
			return message(form, STRINGS.ADMIN.MESSAGES.ADD_SUCCESS);
		} catch (err) {
			const error = err as Error;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.ADD_FAIL, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	},
	editProduct: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals))
			return fail(HTTP_STATUS.FORBIDDEN, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(editProductSchema));
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });
		try {
			const { id, title, description, price, quantity, image } = form.data;
			await ProductService.update(id, title, description, price, quantity, image);
			return message(form, STRINGS.ADMIN.MESSAGES.STOCK_UPDATED);
		} catch (err) {
			const error = err as Error;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.STOCK_FAIL, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	},
	updateOrderStatus: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals))
			return fail(HTTP_STATUS.FORBIDDEN, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(orderStatusSchema));
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });
		try {
			await updateOrderStatus(form.data.id, form.data.status);
			return message(form, STRINGS.ADMIN.MESSAGES.STATUS_UPDATED);
		} catch (err) {
			const error = err as Error;
			const isConflict = 'statusCode' in error && Number(error.statusCode) === HTTP_STATUS.CONFLICT;
			const status = isConflict ? HTTP_STATUS.CONFLICT : HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.STATUS_FAIL, { status });
		}
	},
	deleteProduct: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals))
			return fail(HTTP_STATUS.FORBIDDEN, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(deleteSchema));
		if (!form.valid) return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, { form });
		try {
			await ProductService.delete(form.data.id);
			return message(form, STRINGS.ADMIN.MESSAGES.DELETE_SUCCESS);
		} catch (err) {
			const error = err as Error;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.DELETE_FAIL, {
				status: HTTP_STATUS.INTERNAL_SERVER_ERROR
			});
		}
	},
	updateImage: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals))
			return fail(HTTP_STATUS.FORBIDDEN, { error: STRINGS.COMMON.UNAUTHORIZED });
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const image = formData.get('image');
		if (!id || !image)
			return fail(HTTP_STATUS.UNPROCESSABLE_ENTITY, {
				error: STRINGS.ADMIN.MESSAGES.MISSING_ID_IMAGE
			});
		try {
			await ProductService.updateImage(id, image as string);
			return { success: true };
		} catch (err) {
			return fail(HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: (err as Error).message });
		}
	}
};
