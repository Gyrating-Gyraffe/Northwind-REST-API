import { Request, Response, NextFunction } from "express";
import { RouteNotFoundError } from "../3-models/error-models";

function routeNotFound(request: Request, response: Response, next: NextFunction) {
    next(new RouteNotFoundError(request.originalUrl));
}

export default routeNotFound;