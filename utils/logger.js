import winston from "winston";
import asyncLocalStorage from "./context.js";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.printf(({ level, message, timestamp }) => {
    const store = asyncLocalStorage.getStore();
    const correlationId = store?.correlationId || "N/A";
    return `[${new Date().toISOString()}] [correlationId=${correlationId}] ${level.toUpperCase()}: ${message}`;
  }),
  transports: [new winston.transports.Console()],
});

export default logger;
