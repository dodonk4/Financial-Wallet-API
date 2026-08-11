import { Router } from "express";
import { readinessController } from "../controllers/health/readiness.controller";
import { healthCheckController } from "../controllers/health/healthCheck.controller";

const healthRouter = Router();


healthRouter.get("/", healthCheckController);

healthRouter.get("/ready", readinessController);

export default healthRouter;