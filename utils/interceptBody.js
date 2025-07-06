import { fileURLToPath } from "url";
import { CONSTANTS } from "./Constants.js";
import ENVIRONMENT from "./environment.js";
import logger from "./logger.js";
import { inspect } from "util";

const __filename = fileURLToPath(import.meta.url);

const interceptBody = (req, res, next) => {
  if (
    ["POST", "PUT", "PATCH"]?.includes(req.method?.toUpperCase()) &&
    req.body === undefined
  ) {
    req.body = {};
  } else if (
    ["POST", "PUT", "PATCH"]?.includes(req.method?.toUpperCase()) &&
    ENVIRONMENT.NODE_ENV === CONSTANTS.ENVIRONMENT.DEVELOPMENT
  ) {
    logger(__filename).info(`REQUEST BODY: ${inspect(req.body)}`);
  }
  next();
};
export default interceptBody;
