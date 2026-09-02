import express from "express"
import { NonValidRefreshTokenError } from "../../../domain/errors/NonValidRefreshTokenError";

const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

    if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"){
        throw new NonValidRefreshTokenError();
    }

    next(err);
}

export default errorHandler;