import { UserRepository } from '$lib/server/repositories/userRepository.js';
import { UserAddressRepository } from '$lib/server/repositories/userAddressRepository.js';

export const getUserAddress = async (userId: number) => {
	return await UserAddressRepository.getAddress(userId);
};

export const updateUserAddress = async (userId: number, address: string) => {
	await UserAddressRepository.updateAddress(userId, address);
};

export const updateProfile = async (
	userId: number,
	data: {
		username: string;
		email: string;
		full_name: string | null;
		phone: string | null;
		address: string | null;
		avatar?: string | null;
		password?: string;
	}
) => {
	return await UserRepository.updateProfile(userId, data);
};

export const getUserAddresses = async (userId: number) => {
	return await UserAddressRepository.getUserAddresses(userId);
};

export const saveUserAddress = async (
	userId: number,
	label: string,
	addressText: string,
	isPrimary: boolean = false
) => {
	return await UserAddressRepository.saveUserAddress(userId, label, addressText, isPrimary);
};

export const deleteUserAddress = async (id: number, userId: number) => {
	return await UserAddressRepository.deleteUserAddress(id, userId);
};
