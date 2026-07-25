import express from 'express';
import { prisma } from '../../../../infrastructure/database/prisma';
import { redisClient } from '../../../../infrastructure/cache/redisClient';

export const readinessController = async (req: express.Request, res: express.Response) => {
    try {

        await prisma.$queryRaw`SELECT 1`;

        await redisClient.ping();

        return res.status(200).json({
            status: "ready"
        });

    } catch {

        return res.status(503).json({
            status: "not ready"
        });

    }
}