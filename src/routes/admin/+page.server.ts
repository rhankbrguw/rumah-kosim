import { ProductService } from '$lib/server/services/productService.js';
import { getAllOrdersAdmin, updateOrderStatus } from '$lib/server/services/orderService.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { logger } from '$lib/server/utils/logger.js';
import { STRINGS } from '$lib/constants/strings.js';

const productSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().min(0),
	quantity: z.coerce.number().int().min(0),
	image: z.string().min(1, 'Image is required')
});

const editProductSchema = z.object({
	id: z.coerce.number(),
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().min(0),
	quantity: z.coerce.number().int().min(0),
	image: z.string().min(1, 'Image is required')
});

const orderStatusSchema = z.object({
	id: z.coerce.number(),
	status: z.enum(['Processing', 'Shipped', 'Delivered', 'Cancelled'])
});

const deleteSchema = z.object({
	id: z.coerce.number()
});

export const load = async () => {
	try {
		const [productsRaw, ordersRaw] = await Promise.all([
			ProductService.getAll(),
			getAllOrdersAdmin()
		]);
		const products = productsRaw as unknown as {
			id: number;
			title: string;
			price: number;
			quantity: number;
			image: string;
		}[];
		const orders = ordersRaw as unknown as {
			id: number;
			date: string;
			total: number;
			status: string;
			title?: string;
			username?: string;
			quantity?: number;
			price_at_time?: number;
		}[];

		const productForm = await superValidate(zod(productSchema));
		const editProductForm = await superValidate(zod(editProductSchema));
		const orderStatusForm = await superValidate(zod(orderStatusSchema));
		const deleteForm = await superValidate(zod(deleteSchema));

		return { products, orders, productForm, editProductForm, orderStatusForm, deleteForm };
	} catch (error) {
		logger.error('Failed to load admin data:', error as Error);
		const productForm = await superValidate(zod(productSchema));
		const editProductForm = await superValidate(zod(editProductSchema));
		const orderStatusForm = await superValidate(zod(orderStatusSchema));
		const deleteForm = await superValidate(zod(deleteSchema));
		return { products: [], orders: [], productForm, editProductForm, orderStatusForm, deleteForm };
	}
};

export const actions = {
	addProduct: async ({ request }: any) => {
		const form = await superValidate(request, zod(productSchema));
		if (!form.valid) return fail(422, { form });
		try {
			await ProductService.create(
				form.data.title,
				form.data.price,
				form.data.image,
				form.data.description,
				form.data.quantity
			);
			return message(form, STRINGS.ADMIN.MESSAGES.ADD_SUCCESS);
		} catch (error: any) {
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.ADD_FAIL, { status: 500 });
		}
	},
	editProduct: async ({ request }: any) => {
		const form = await superValidate(request, zod(editProductSchema));
		if (!form.valid) return fail(422, { form });
		try {
			await ProductService.update(
				form.data.id,
				form.data.title,
				form.data.description,
				form.data.price,
				form.data.quantity,
				form.data.image
			);
			return message(form, STRINGS.ADMIN.MESSAGES.STOCK_UPDATED);
		} catch (error: any) {
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.STOCK_FAIL, { status: 500 });
		}
	},
	updateOrderStatus: async ({ request }: any) => {
		const form = await superValidate(request, zod(orderStatusSchema));
		if (!form.valid) return fail(422, { form });
		try {
			await updateOrderStatus(form.data.id, form.data.status);
			return message(form, STRINGS.ADMIN.MESSAGES.STATUS_UPDATED);
		} catch (error: any) {
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.STATUS_FAIL, { status: 500 });
		}
	},
	deleteProduct: async ({ request }: any) => {
		const form = await superValidate(request, zod(deleteSchema));
		if (!form.valid) return fail(422, { form });
		try {
			await ProductService.delete(form.data.id);
			return message(form, STRINGS.ADMIN.MESSAGES.DELETE_SUCCESS);
		} catch (error: any) {
			return message(form, error.message || STRINGS.ADMIN.MESSAGES.DELETE_FAIL, { status: 500 });
		}
	},
	updateImage: async ({ request }: any) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const image = data.get('image');
		if (!id || !image) return fail(422, { error: STRINGS.ADMIN.MESSAGES.MISSING_ID_IMAGE });
		try {
			await ProductService.updateImage(id, image as string);
			return { success: true };
		} catch (error: any) {
			return fail(500, { error: error.message });
		}
	}
};
