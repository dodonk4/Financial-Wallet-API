import express from 'express';

export const healthCheckController = (req: express.Request, res: express. Response) => {
    res.json({
        status: "ok",
    })
}