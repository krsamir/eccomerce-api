import jwt from "jsonwebtoken";
import { CONSTANTS, RESPONSE_STATUS, ROLES_NAME } from "../Constants.js";
import ENVIRONMENT from "../environment.js";
import logger from "../logger.js";
import { inspect } from "util";

export const capabilityHandler = (req, roles) => {
  if (roles.length === 0) {
    roles = [
      ROLES_NAME.ADMIN,
      ROLES_NAME.DELIVERY_PARTNER,
      ROLES_NAME.MANAGER,
      ROLES_NAME.SUPER_ADMIN,
      ROLES_NAME.USER,
    ];
  }
  try {
    let token = req?.header(CONSTANTS.AUTHORIZATION);
    token = token?.replace("Bearer ", "");
    const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
    logger.info(`[ROLE ACCESS -> ${inspect(roles)}]`);
    if (roles?.includes(decoded?.role)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const CAPABILITY =
  (roles = []) =>
  (req, res, next) => {
    try {
      if (capabilityHandler(req, roles)) {
        next();
      } else {
        throw Error("Unauthorized to access this api.");
      }
    } catch {
      logger.error({ message: `UNAUTHORIZED ACCESS!!` });
      res.status(RESPONSE_STATUS.FORBIDDEN_403).send({
        message: `UNAUTHORIZED ACCESS!!`,
        status: CONSTANTS.STATUS.FAILURE,
      });
    }
  };
