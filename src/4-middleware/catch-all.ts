import { Request, Response, NextFunction } from "express";
import StatusCode from "../3-models/status-code";

function catchAll(err: any, request: Request, response: Response, next: NextFunction): void {  
    // On any backend error, this middleware should be executed.

    // Log error on console:
    console.log("Error: ", err);

    const status = err.status || StatusCode.InternalServerError;
    const message = err.message;

    // Respond back with the error:
    response.status(status).send(message);

    next();
}

export default catchAll