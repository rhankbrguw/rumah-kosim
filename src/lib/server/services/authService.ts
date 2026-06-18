import { UserRepository } from '$lib/server/repositories/userRepository.js';

export const getUserByUsername = async (username: string) => {
	return await UserRepository.getByUsername(username);
};

export const createUser = async (username: string, hashedPassword: string, email: string) => {
	await UserRepository.create(username, hashedPassword, email);
};
