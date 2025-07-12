import winston from "winston";
import asyncLocalStorage from "./context.js";
import { CONSTANTS } from "./Constants.js";
import os from "os";

const logger = (__filename) => {
  let file_list = "";
  if (os.platform() === "linux") {
    file_list = __filename.split("/");
  } else {
    file_list = __filename.split("\\");
  }
  const len = file_list?.length;

  let paths = "";
  if (file_list[len - 3]) {
    paths += `${file_list[len - 3]}/`;
  }
  if (file_list[len - 2]) {
    paths += `${file_list[len - 2]}/`;
  }
  if (file_list[len - 1]) {
    paths += `${file_list[len - 1]}`;
  }

  return winston.createLogger({
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
        return `[${new Date().toISOString()}] [correlationId=${correlationId}] [${paths}] ${level.toUpperCase()} [PATH=${path}] [METHOD=${method}] ${
          message === CONSTANTS.ROUTE_LOGS ? "" : `: ${message}`
        }`;
      }
      return `[${new Date().toISOString()}] ${correlationId !== "N/A" ? `[correlationId=${correlationId}]` : ""} [${paths}] ${level.toUpperCase()}: ${message}`;
    }),
    transports: [new winston.transports.Console()],
  });
};
export default logger;
