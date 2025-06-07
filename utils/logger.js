import winston from "winston";
import asyncLocalStorage from "./context.js";
import { CONSTANTS } from "./Constants.js";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.printf(({ level, message }) => {
    const store = asyncLocalStorage.getStore();
    const correlationId = store?.correlationId || "N/A";
    const path = store?.path || "N/A";
    const method = store?.method || "N/A";
    if (
      path !== "N/A" &&
      method !== "N/A" &&
      message === CONSTANTS.ROUTE_LOGS
    ) {
      return `[${new Date().toISOString()}] [correlationId=${correlationId}] ${level.toUpperCase()} [PATH]=[${path}] [METHOD]=[${method}] ${
        message === CONSTANTS.ROUTE_LOGS ? "" : `: ${message}`
      }`;
    }
    return `[${new Date().toISOString()}] [correlationId=${correlationId}] ${level.toUpperCase()}: ${message}`;
  }),
  transports: [new winston.transports.Console()],
});

export default logger;
