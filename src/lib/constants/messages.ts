export const MESSAGES = {
	SUCCESS: {
		FETCH: 'Data retrieved successfully',
		CREATE: 'Created successfully',
		UPDATE: 'Updated successfully',
		DELETE: 'Deleted successfully',
		AUTH: 'Authenticated successfully'
	},
	ERROR: {
		SERVER: 'Internal Server Error',
		NOT_FOUND: 'Resource not found',
		UNAUTHORIZED: 'Unauthorized access',
		FORBIDDEN: 'Forbidden access',
		VALIDATION: 'Validation failed',
		DB_CONNECTION: 'Database connection error'
	},
	VALIDATION: {
		USERNAME_REQUIRED: 'Username is required',
		PASSWORD_REQUIRED: 'Password is required',
		PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
		EMAIL_INVALID: 'Invalid email address',
		EMAIL_FORMAT: 'Please enter a valid industry-standard email address',
		TOKEN_REQUIRED: 'Token is required'
	}
};
