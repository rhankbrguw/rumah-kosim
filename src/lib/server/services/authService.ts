import { UserRepository } from '$lib/server/repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET } from '$env/static/private';
import { APP_CONFIG } from '$lib/constants/config.js';
import { sendOTP, sendResetPassword } from '$lib/server/utils/mailer.js';
import { AuthException, NotFoundException } from '$lib/server/utils/exceptions.js';
import { ERROR_CODES } from '$lib/constants/errorCodes.js';
export const getUserById = async (id: number) => {
	return await UserRepository.getById(id);
};

export const getUserByResetToken = async (token: string) => {
	return await UserRepository.getByResetToken(token);
};

export const resetPassword = async (token: string, newHashedPassword: string) => {
	return await UserRepository.resetPassword(token, newHashedPassword);
};

export const loginUser = async (
	username: string,
	password: string,
	checkVerification: boolean = false
) => {
	const normalizedUsername = username.trim();
	const user = await UserRepository.getByUsername(normalizedUsername);
	if (!user) throw new AuthException(ERROR_CODES.INVALID_CREDENTIALS);

	if (checkVerification && user.is_verified === 0) {
		throw new AuthException('ACCOUNT_NOT_VERIFIED');
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) throw new AuthException(ERROR_CODES.INVALID_CREDENTIALS);

	const payload = {
		id: user.id,
		username: user.username,
		email: user.email,
		role: user.role
	};
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
	return { user, token };
};

export const registerUser = async (username: string, password: string, email: string) => {
	const hashedPassword = await bcrypt.hash(password, APP_CONFIG.BCRYPT_SALT_ROUNDS);
	const result = await UserRepository.create(username, hashedPassword, email);
	const user = await UserRepository.getByUsername(username);

	if (result.isFirstUser) {
		const payload = { id: user?.id, username, email, role: 'admin' };
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
		return { isFirstUser: true, user, token };
	} else {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		await UserRepository.setOTP(user!.id, otp);
		await sendOTP(email, otp);
		return { isFirstUser: false, user };
	}
};

export const verifyUserOtp = async (userId: number, otp: string) => {
	const isValid = await UserRepository.verifyOTP(userId, otp);
	if (!isValid) throw new AuthException('INVALID_OTP');

	const user = await UserRepository.getById(userId);
	if (!user) throw new NotFoundException(ERROR_CODES.NOT_FOUND);

	const payload = {
		id: user.id,
		username: user.username,
		email: user.email,
		role: user.role
	};
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN });
	return { user, token };
};

export const processForgotPassword = async (email: string) => {
	const user = await UserRepository.getByEmail(email);
	if (user) {
		const token = crypto.randomBytes(32).toString('hex');
		await UserRepository.setResetToken(email, token);
		await sendResetPassword(email, token);
	}
};

export const validateToken = (token: string) => {
	return jwt.verify(token, JWT_SECRET);
};
