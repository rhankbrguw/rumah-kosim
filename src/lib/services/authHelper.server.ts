import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { updateProfile } from '$lib/server/services/profileService.js';
import {
	resetPassword as authResetPassword,
	getUserByResetToken
} from '$lib/server/services/authService.js';

async function processAvatarFile(_userId: number, avatarFile: File | null): Promise<string | null> {
	if (!avatarFile || avatarFile.size === 0) return null;
	const mimeType = avatarFile.type || 'image/png';
	const arrayBuffer = await avatarFile.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

function processPhoneNumber(phoneData: string | null): string | null {
	let finalPhone = phoneData?.replace(/\D/g, '') || null;
	if (finalPhone) {
		if (finalPhone.startsWith('62')) finalPhone = finalPhone.substring(2);
		else if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
		finalPhone = '+62' + finalPhone;
	}
	return finalPhone;
}

export const handleProfileUpdate = async (
	userId: number,
	formData: FormData,
	currentAvatar: string,
	currentRole: string
) => {
	const dataToUpdate: Record<string, unknown> = {
		username: formData.get('username') as string,
		email: formData.get('email') as string,
		full_name: (formData.get('full_name') as string) || null,
		address: (formData.get('address') as string) || null,
		phone: processPhoneNumber(formData.get('phone') as string | null)
	};

	const newAvatar = await processAvatarFile(userId, formData.get('avatar') as File);
	if (newAvatar) dataToUpdate.avatar = newAvatar;

	const password = formData.get('password') as string;
	if (password && password.length >= 6) {
		dataToUpdate.password = await bcrypt.hash(password, 10);
	}

	await updateProfile(userId, dataToUpdate as Parameters<typeof updateProfile>[1]);

	const payload = {
		id: userId,
		username: dataToUpdate.username,
		email: dataToUpdate.email,
		role: currentRole
	};
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const handleResetPassword = async (token: string, password: string) => {
	const user = await getUserByResetToken(token);
	if (!user || new Date() > new Date(user.reset_expires_at)) {
		return { success: false, error: 'Invalid or expired token', status: 400 };
	}

	const isSamePassword = await bcrypt.compare(password, user.password);
	if (isSamePassword) {
		return {
			success: false,
			error: 'New password cannot be the same as your old password',
			status: 400
		};
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const success = await authResetPassword(token, hashedPassword);

	if (!success) return { success: false, error: 'Invalid or expired token', status: 400 };

	return { success: true };
};
