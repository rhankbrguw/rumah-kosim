export const RESET_PASSWORD_STRINGS = {
	TITLE: 'Reset Password',
	SUBTITLE: 'Enter your new password below',
	RETURN_LOGIN: 'Return to Login',
	MESSAGES: {
		FAILED: 'Failed to reset password',
		INVALID_TOKEN: 'Invalid or expired token',
		SAME_PASSWORD: 'New password cannot be the same as your old password',
		TOKEN_MISSING: 'Token is missing',
		PASSWORD_MIN: 'Password must be at least 6 characters',
		PASSWORD_MISMATCH: "Passwords don't match"
	}
} as const;
