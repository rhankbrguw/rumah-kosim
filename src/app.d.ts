// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare module 'jsonwebtoken';
declare module 'midtrans-client';
declare global {
	namespace App {
		interface Locals {
			user: {
				id: number;
				username: string;
				email: string;
				role: string;
				avatar?: string;
			} | null;
			correlationId: string;
		}
		interface PageData {
			user: {
				id: number;
				username: string;
				email: string;
				role: string;
				avatar?: string;
			} | null;
		}
	}
}

export {};
