import { Messages } from "../enums/Messages.js";

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends AppError {
    constructor(message = Messages.INVALID_DATA) {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = Messages.TOKEN_REQUIRED) {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = Messages.FORBIDDEN) {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message = Messages.ROUTE_NOT_FOUND) {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = Messages.DUPLICATED_RESOURCE) {
        super(message, 409);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = Messages.TOO_MANY_REQUESTS) {
        super(message, 429);
    }
}

export default AppError;
