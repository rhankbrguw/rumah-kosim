export class AppException extends Error {
	public statusCode: number;
	constructor(message: string, statusCode: number = 500) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class ValidationException extends AppException {
	constructor(message: string) {
		super(message, 422);
	}
}

export class AuthException extends AppException {
	constructor(message: string) {
		super(message, 401);
	}
}

export class ForbiddenException extends AppException {
	constructor(message: string) {
		super(message, 403);
	}
}

export class NotFoundException extends AppException {
	constructor(message: string) {
		super(message, 404);
	}
}

export class ConflictException extends AppException {
	constructor(message: string) {
		super(message, 409);
	}
}

export class InternalException extends AppException {
	constructor(message: string) {
		super(message, 500);
	}
}
