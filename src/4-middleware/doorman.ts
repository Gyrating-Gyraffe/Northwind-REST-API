import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../3-models/error-models";


function doorman(request: Request, response: Response, next: NextFunction) {
    const doormanKey = "I-Love-Mustard!";

    if(request.header("doormanKey") !== doormanKey) {
        next(new UnauthorizedError("You are not authorized!"));
        return;
    }

    next();
}

export default doorman;