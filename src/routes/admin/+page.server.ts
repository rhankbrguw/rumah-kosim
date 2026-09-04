import { ProductService } from '$lib/server/services/productService.js';
import { getAllOrdersAdmin, updateOrderStatus } from '$lib/server/services/orderService.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import type { RequestEvent } from '@sveltejs/kit';
import { logger } from '$lib/server/utils/logger.js';
import { STRINGS } from '$lib/constants/strings.js';
import { APP_CONFIG } from '$lib/constants/config.js';
import type { Order } from '$lib/types';

import {
	adminProductSchema as productSchema,
	adminEditProductSchema as editProductSchema,
	adminOrderStatusSchema as orderStatusSchema,
	adminDeleteSchema as deleteSchema
} from '$lib/server/validations/admin.js';

export const load = async ({ url }: RequestEvent) => {
	try {
		const productPage = Number(url.searchParams.get('productPage')) || 1;
		const orderPage = Number(url.searchParams.get('orderPage')) || 1;
		const search = url.searchParams.get('search') || undefined;
		const limit = APP_CONFIG.DEFAULT_PAGINATION_LIMIT;

		const [productsRaw, ordersRaw] = await Promise.all([
			ProductService.getAll(productPage, limit, search),
			getAllOrdersAdmin(orderPage, limit)
		]);
		const orders = ordersRaw as unknown as { data: Order[]; total: number };

		const productForm = await superValidate(zod(productSchema));
		const editProductForm = await superValidate(zod(editProductSchema));
		const orderStatusForm = await superValidate(zod(orderStatusSchema));
		const deleteForm = await superValidate(zod(deleteSchema));

		return {
			products: productsRaw as unknown as {
				data: { id: number; title: string; price: number; quantity: number; image: string }[];
				total: number;
			},
			orders,
			productForm,
			editProductForm,
			orderStatusForm,
			deleteForm,
			productPage,
			orderPage,
			search,
			limit
		};
	} catch (error) {
		logger.error('Failed to load admin data:', error as Error);
		const productForm = await superValidate(zod(productSchema));
		const editProductForm = await superValidate(zod(editProductSchema));
		const orderStatusForm = await superValidate(zod(orderStatusSchema));
		const deleteForm = await superValidate(zod(deleteSchema));
		return {
			products: { data: [], total: 0 },
			orders: { data: [], total: 0 },
			productForm,
			editProductForm,
			orderStatusForm,
			deleteForm,
			productPage: 1,
			orderPage: 1,
			search: undefined,
			limit: 20
		};
	}
};

const ensureAdmin = (locals: App.Locals) => locals.user?.role === 'admin';

export const actions = {
	addProduct: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals)) return fail(403, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(productSchema));
		if (!form.valid) return fail(422, { form });
		try {
			const { title, price, image, description, quantity } = form.data;
			await ProductService.create(title, price, image, description, quantity);
			return message(form, STRINGS.ADMIN.MESSAGES.ADD_SUCCESS);
		} catch (err) {
			const error = err as Error;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.ADD_FAIL, { status: 500 });
		}
	},
	editProduct: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals)) return fail(403, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(editProductSchema));
		if (!form.valid) return fail(422, { form });
		try {
			const { id, title, description, price, quantity, image } = form.data;
			await ProductService.update(id, title, description, price, quantity, image);
			return message(form, STRINGS.ADMIN.MESSAGES.STOCK_UPDATED);
		} catch (err) {
			const error = err as Error;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.STOCK_FAIL, { status: 500 });
		}
	},
	updateOrderStatus: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals)) return fail(403, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(orderStatusSchema));
		if (!form.valid) return fail(422, { form });
		try {
			await updateOrderStatus(form.data.id, form.data.status);
			return message(form, STRINGS.ADMIN.MESSAGES.STATUS_UPDATED);
		} catch (err) {
			const error = err as Error;
			const status = 'statusCode' in error && Number(error.statusCode) === 409 ? 409 : 500;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.STATUS_FAIL, { status });
		}
	},
	deleteProduct: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals)) return fail(403, { error: STRINGS.COMMON.UNAUTHORIZED });
		const form = await superValidate(request, zod(deleteSchema));
		if (!form.valid) return fail(422, { form });
		try {
			await ProductService.delete(form.data.id);
			return message(form, STRINGS.ADMIN.MESSAGES.DELETE_SUCCESS);
		} catch (err) {
			const error = err as Error;
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.DELETE_FAIL, { status: 500 });
		}
	},
	updateImage: async ({ request, locals }: RequestEvent) => {
		if (!ensureAdmin(locals)) return fail(403, { error: STRINGS.COMMON.UNAUTHORIZED });
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const image = formData.get('image');
		if (!id || !image) return fail(422, { error: STRINGS.ADMIN.MESSAGES.MISSING_ID_IMAGE });
		try {
			await ProductService.updateImage(id, image as string);
			return { success: true };
		} catch (err) {
			return fail(500, { error: (err as Error).message });
		}
	}
};
