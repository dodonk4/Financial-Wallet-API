import { TransferUsecase } from "../../../../application/use-cases/transfers/transfer/TransferUseCase";
import { Request, Response } from "express";


export class TransfersController {
    constructor(
        private readonly transferUseCase: TransferUsecase,
    ) { }

    transfer = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        if(!req.headers.authorization){
            throw new Error("User not authenticated"); //Create new error
        }
        const response = await this.transferUseCase.execute(req.body, req.headers.authorization);
        res.status(201).json(response);
    }
}