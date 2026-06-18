import { ProductService } from '$lib/server/services/productService.js';
import { getAllOrdersAdmin } from '$lib/server/services/orderService.js';
import { query } from '$lib/db.js';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const productSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().min(0),
	quantity: z.coerce.number().int().min(0),
	image: z.string().min(1, 'Image is required')
});

const stockSchema = z.object({
	id: z.coerce.number(),
	quantity: z.coerce.number().int().min(0)
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
		const products = productsRaw as unknown as { id: number, title: string, price: number, quantity: number, image: string }[];
		const orders = ordersRaw as unknown as { id: number, date: string, total: number, status: string, title?: string, username?: string, quantity?: number, price_at_time?: number }[];
		
		const productForm = await superValidate(zod(productSchema));
		const stockForm = await superValidate(zod(stockSchema));
		const orderStatusForm = await superValidate(zod(orderStatusSchema));
		const deleteForm = await superValidate(zod(deleteSchema));

		return { products, orders, productForm, stockForm, orderStatusForm, deleteForm };
	} catch (error) {
		console.error('Failed to load admin data:', error);
		const productForm = await superValidate(zod(productSchema));
		const stockForm = await superValidate(zod(stockSchema));
		const orderStatusForm = await superValidate(zod(orderStatusSchema));
		const deleteForm = await superValidate(zod(deleteSchema));
		return { products: [], orders: [], productForm, stockForm, orderStatusForm, deleteForm };
	}
};

export const actions = {
	addProduct: async ({ request }: any) => {
		const form = await superValidate(request, zod(productSchema));
		if (!form.valid) return fail(400, { form });
		try {
			await query('INSERT INTO products (title, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)', [
				form.data.title, form.data.description, form.data.price, form.data.quantity, form.data.image
			]);
			return message(form, 'Product added successfully');
		} catch (error: any) {
			return message(form, error.message || 'Failed to add product', { status: 500 });
		}
	},
	updateStock: async ({ request }: any) => {
		const form = await superValidate(request, zod(stockSchema));
		if (!form.valid) return fail(400, { form });
		try {
			await query('UPDATE products SET quantity = ? WHERE id = ?', [form.data.quantity, form.data.id]);
			return message(form, 'Stock updated');
		} catch (error: any) {
			return message(form, error.message || 'Failed to update stock', { status: 500 });
		}
	},
	updateOrderStatus: async ({ request }: any) => {
		const form = await superValidate(request, zod(orderStatusSchema));
		if (!form.valid) return fail(400, { form });
		try {
			await query('UPDATE orders SET status = ? WHERE id = ?', [form.data.status, form.data.id]);
			return message(form, 'Status updated');
		} catch (error: any) {
			return message(form, error.message || 'Failed to update status', { status: 500 });
		}
	},
	deleteProduct: async ({ request }: any) => {
		const form = await superValidate(request, zod(deleteSchema));
		if (!form.valid) return fail(400, { form });
		try {
			await query('DELETE FROM products WHERE id = ?', [form.data.id]);
			return message(form, 'Product deleted');
		} catch (error: any) {
			return message(form, error.message || 'Failed to delete product', { status: 500 });
		}
	},
	updateImage: async ({ request }: any) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const image = data.get('image');
		if (!id || !image) return fail(400, { error: 'Missing id or image' });
		try {
			await query('UPDATE products SET image = ? WHERE id = ?', [image, id]);
			return { success: true };
		} catch (error: any) {
			return fail(500, { error: error.message });
		}
	}
};
