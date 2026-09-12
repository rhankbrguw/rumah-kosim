import { HTTP_STATUS } from '$lib/constants/config.js';

class AppException extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class ValidationException extends AppException {
	constructor(message: string) {
		super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
	}
}

export class AuthException extends AppException {
	constructor(message: string) {
		super(message, HTTP_STATUS.UNAUTHORIZED);
	}
}

export class ForbiddenException extends AppException {
	constructor(message: string) {
		super(message, HTTP_STATUS.FORBIDDEN);
	}
}

export class NotFoundException extends AppException {
	constructor(message: string) {
		super(message, HTTP_STATUS.NOT_FOUND);
	}
}

export class ConflictException extends AppException {
	constructor(message: string) {
		super(message, HTTP_STATUS.CONFLICT);
	}
}

export class InternalException extends AppException {
	constructor(message: string) {
		super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
	}
}
