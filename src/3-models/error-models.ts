import StatusCode from "./status-code";

abstract class ClientError {
    constructor(public status: number, public message: string) {}
}

export class ValidationError extends ClientError {
    constructor(message: string) {
        super(StatusCode.BadRequest, message);
    }
}

export class UnauthorizedError extends ClientError {
    constructor(message: string) {
        super(StatusCode.Unauthorized, message);
    }
}

export class ForbiddenError extends ClientError {
    constructor(message: string) {
        super(StatusCode.Forbidden, message);
    }
}

export class RouteNotFoundError extends ClientError {
    constructor(route: string) {
        super(StatusCode.NotFound, `Route not found: ${route}`);
    }
}

export class ResourceNotFound extends ClientError {
    constructor(id: number) {
        super(StatusCode.NotFound, `ID not found: ${id}`);
    }
}