import jwt from "jsonwebtoken";
import ENVIRONMENT from "../environment.js";
import { RESPONSE_STATUS } from "../Constants.js";
import logger from "../logger.js";

export const checkIsAuthenticated = (req) => {
  try {
    let token = req.header("Authorization");
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
    req.id = decoded?.id;
    req.email = decoded?.email;
    req.user_name = decoded?.user_name;
    req.role_id = decoded?.role_id;
    req.role = decoded?.role;
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const isAutehnticated = (req, res, next) => {
  if (checkIsAuthenticated(req)) {
    next();
  } else {
    logger.error({ error: "Authentication Required. Please login again." });
    res
      .status(RESPONSE_STATUS.UNAUTHORIZED_401)
      .send({ message: "Authentication Required. Please login again." });
  }
};
