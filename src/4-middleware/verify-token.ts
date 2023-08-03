import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../3-models/error-models";
import cyber from "../2-utils/cyber";

// Verify token validity:
function verifyToken(request: Request, response: Response, next: NextFunction) {
    // Authorization:
    const authorizationHeader = request.header("authorization");

    // Extract the token:
    const token = authorizationHeader?.substring(7, authorizationHeader.length);

    // Verify the token:
    cyber.verifyToken(token);

    next();
}

export default verifyToken;