import { createServer } from "node:http";
import { app } from "./compositionRoot.ts";
import { logger } from "./infrastructure/logger/index.ts";

const PORT = Number(process.env.PORT) || 3000;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
