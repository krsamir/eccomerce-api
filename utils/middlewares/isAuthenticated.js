import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { inspect } from "util";
import ENVIRONMENT from "../environment.js";
import { CONSTANTS, RESPONSE_STATUS } from "../Constants.js";
import logs from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

export const checkIsAuthenticatedHandler = (req) => {
  try {
    let token = req.header(CONSTANTS.AUTHORIZATION);
    console.log("🚀 ~ checkIsAuthenticatedHandler ~ token:", token);
    token = token?.replace("Bearer ", "");
    const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
    req.id = decoded?.id;
    req.email = decoded?.email;
    req.user_name = decoded?.user_name;
    req.role_id = decoded?.role_id;
    req.role = decoded?.role;
    return true;
  } catch (error) {
    logger.error(inspect(error));
    return false;
  }
};

export const isAuthenticated = (req, res, next) => {
  if (checkIsAuthenticatedHandler(req)) {
    next();
  } else {
    logger.error(
      inspect({ error: "Authentication Required. Please login again." }),
    );
    res
      .status(RESPONSE_STATUS.UNAUTHORIZED_401)
      .send({ message: "Authentication Required. Please login again." });
  }
};
