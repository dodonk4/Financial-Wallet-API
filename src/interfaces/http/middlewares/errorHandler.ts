import express from "express"
import { UnauthorizedError } from "../../../domain/errors/http/UnauthorizedError";

const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

    if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"){
        throw new UnauthorizedError("The token provided is invalid, expired, revoked or used");
    }

    next(err);
}

export default errorHandler;