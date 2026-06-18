export const logger = {
	info: (message: string, context: Record<string, unknown> = {}) => {
		console.log(
			JSON.stringify({
				level: 'INFO',
				timestamp: new Date().toISOString(),
				message,
				...context
			})
		);
	},
	error: (message: string, error: Error | null = null, context: Record<string, unknown> = {}) => {
		const errorDetails = error ? { errorMessage: error.message, stack: error.stack } : {};
		console.error(
			JSON.stringify({
				level: 'ERROR',
				timestamp: new Date().toISOString(),
				message,
				...errorDetails,
				...context
			})
		);
	},
	warn: (message: string, context: Record<string, unknown> = {}) => {
		console.warn(
			JSON.stringify({
				level: 'WARN',
				timestamp: new Date().toISOString(),
				message,
				...context
			})
		);
	}
};
