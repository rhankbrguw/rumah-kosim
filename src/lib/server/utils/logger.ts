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
	error: (message: string, error: unknown = null, context: Record<string, unknown> = {}) => {
		const serializedError =
			error instanceof Error
				? { errorMessage: error.message, stack: error.stack }
				: { errorDetails: error };
		console.error(
			JSON.stringify({
				level: 'ERROR',
				timestamp: new Date().toISOString(),
				message,
				...serializedError,
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
