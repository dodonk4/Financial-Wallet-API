import { app } from "./compositionRoot.ts";
import { logger } from "./infrastructure/logger/index.ts";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
