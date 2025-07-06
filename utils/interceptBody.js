import { fileURLToPath } from "url";
import { CONSTANTS } from "./Constants.js";
import ENVIRONMENT from "./environment.js";
import logs from "./logger.js";
import { inspect } from "util";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

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
    logger.info(`REQUEST BODY: ${inspect(req.body)}`);
  }
  next();
};
export default interceptBody;
