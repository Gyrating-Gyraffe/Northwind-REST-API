import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../3-models/error-models";
import cyber from "../2-utils/cyber";

// Verify token validity:
function verifyAdmin(request: Request, response: Response, next: NextFunction) {
    // Authorization:
    const authorizationHeader = request.header("authorization");

    // Extract the token:
    const token = authorizationHeader?.substring(7, authorizationHeader.length);

    // Verify the token:
    cyber.verifyAdmin(token);

    next();
}

export default verifyAdmin;