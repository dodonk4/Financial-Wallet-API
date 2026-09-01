import express from "express"

const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(err.name){
        console.log("Mensaje de error: ", err.name);
    }
    next(err);
}

export default errorHandler;