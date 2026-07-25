import pino from "pino";

const options: pino.LoggerOptions = {
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
};

if (process.env.NODE_ENV !== "production") {
  options.transport = {
    target: "pino-pretty",
  };
}

export const logger = pino(options);