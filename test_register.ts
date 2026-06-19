import { UserRepository } from './src/lib/server/repositories/userRepository.js';
import bcrypt from 'bcrypt';

async function test() {
	try {
		console.log('Testing create user...');
		const hash = await bcrypt.hash('password123', 10);
		await UserRepository.create('testuser', hash, 'test@example.com');
		console.log('Success!');
	} catch (e: any) {
		console.error('Failed:', e);
	}
	process.exit(0);
}
test();
