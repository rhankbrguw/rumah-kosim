import { UserRepository } from '$lib/server/repositories/userRepository.js';

export const getUserByUsername = async (username: string) => {
	return await UserRepository.getByUsername(username);
};

export const getUserById = async (id: number) => {
	return await UserRepository.getById(id);
};

export const getUserByResetToken = async (token: string) => {
	return await UserRepository.getByResetToken(token);
};

export const createUser = async (username: string, hashedPassword: string, email: string) => {
	return await UserRepository.create(username, hashedPassword, email);
};

export const getUserByEmail = async (email: string) => {
	return await UserRepository.getByEmail(email);
};

export const setOTP = async (userId: number, otp: string) => {
	await UserRepository.setOTP(userId, otp);
};

export const verifyOTP = async (userId: number, otp: string) => {
	return await UserRepository.verifyOTP(userId, otp);
};

export const setResetToken = async (email: string, token: string) => {
	await UserRepository.setResetToken(email, token);
};

export const resetPassword = async (token: string, newHashedPassword: string) => {
	return await UserRepository.resetPassword(token, newHashedPassword);
};

export const getUserAddress = async (userId: number) => {
	return await UserRepository.getAddress(userId);
};

export const updateUserAddress = async (userId: number, address: string) => {
	await UserRepository.updateAddress(userId, address);
};

export const updateProfile = async (userId: number, data: { username: string, email: string, full_name: string | null, phone: string | null, address: string | null, avatar?: string | null, password?: string }) => {
	await UserRepository.updateProfile(userId, data);
};
