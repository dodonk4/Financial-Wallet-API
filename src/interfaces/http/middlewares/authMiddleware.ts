import { Request, Response, NextFunction } from "express";
import { ITokenServiceProvider } from "../../../application/ports/output/ITokenServiceProvider";
import { IAuthMiddleware } from "../../../application/ports/input/IAuthMiddleware";
import extractToken from "../auth/extractToken";

export class AuthMiddleware implements IAuthMiddleware{
    constructor(private readonly tokenProvider: ITokenServiceProvider){}

    verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
        
        if(!req.headers.authorization){
            throw new Error("User not authenticated"); //Create new error
        }

        const token = extractToken(req.headers.authorization);

        await this.tokenProvider.verifyAccessToken(token);

        next();

    }
}