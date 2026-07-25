import { Router } from "express";
import { readinessController } from "../controllers/health/readiness.controller";
import { healthCheckController } from "../controllers/health/healthCheck.controller";

const router = Router();


router.get("/", healthCheckController);

router.get("/ready", readinessController);

export default router;