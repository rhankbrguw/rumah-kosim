declare module 'midtrans-client';

interface Window {
	snap?: {
		pay: (token: string, options: Record<string, unknown>) => void;
	};
}
