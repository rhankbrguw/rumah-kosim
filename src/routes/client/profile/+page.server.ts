import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { profileSchema } from '$lib/server/validations/auth.js';
import { getUserById } from '$lib/server/services/authService.js';
import { updateProfile } from '$lib/server/services/authService.js';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/client/auth');
	}

	const user = await getUserById(locals.user.id);
	if (!user) throw redirect(302, '/client/auth');

	let cleanPhone = user.phone || '';
	if (cleanPhone) {
		cleanPhone = cleanPhone.replace(/\D/g, '');
		if (cleanPhone.startsWith('62')) cleanPhone = cleanPhone.substring(2);
		else if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
	}

	const form = await superValidate(
		{
			username: user.username,
			email: user.email,
			full_name: user.full_name || '',
			phone: cleanPhone,
			address: user.address || ''
		},
		zod(profileSchema)
	);

	return { form, avatar: user.avatar };
};

export const actions = {
	default: async ({ request, locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/client/auth');

		const formData = await request.formData();
		const form = await superValidate(formData, zod(profileSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			let finalPhone = form.data.phone ? form.data.phone.replace(/\D/g, '') : null;
			if (finalPhone) {
				if (finalPhone.startsWith('62')) finalPhone = finalPhone.substring(2);
				else if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
				finalPhone = '+62' + finalPhone;
			}

			const dataToUpdate: any = {
				username: form.data.username,
				email: form.data.email,
				full_name: form.data.full_name || null,
				phone: finalPhone,
				address: form.data.address || null
			};

			const avatarFile = formData.get('avatar') as File;
			if (avatarFile && avatarFile.size > 0) {
				const ext = avatarFile.name.split('.').pop() || 'png';
				const filename = `avatar_${locals.user.id}_${Date.now()}.${ext}`;
				const arrayBuffer = await avatarFile.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				fs.writeFileSync(`static/uploads/avatars/${filename}`, buffer);
				dataToUpdate.avatar = `/uploads/avatars/${filename}`;
			}

			if (form.data.password && form.data.password.length >= 6) {
				dataToUpdate.password = await bcrypt.hash(form.data.password, 10);
			}

			await updateProfile(locals.user.id, dataToUpdate);

			const newAvatar = dataToUpdate.avatar || locals.user.avatar;
			const payload = { id: locals.user.id, username: dataToUpdate.username, email: dataToUpdate.email, role: locals.user.role, avatar: newAvatar };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
			
			cookies.set('authToken', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});

			return { form, success: true };
		} catch (error) {
			return fail(500, { form, error: 'Failed to update profile' });
		}
	}
};
