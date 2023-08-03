import { Request, Response, NextFunction } from "express";

function verbose(request: Request, response: Response, next: NextFunction): void {
    const date = new Date();

    console.log("Time: " + date);
    console.log("Route: " + request.originalUrl);
    console.log("Method: " + request.method);
    console.log("Body: ", request.body);
    console.log("\n======================================");

    next();
}

export default verbose;