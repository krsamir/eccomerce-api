import {
  checkIsAuthenticatedHandler,
  CONSTANTS,
  ENVIRONMENT,
  logger as logs,
  RESPONSE_STATUS,
  TRANSFORMERS,
  transformText,
} from "@ecom/utils";
import { UserService } from "@ecom/datasource";
import { inspect } from "util";
import { handlers } from "@ecom/mail";
import knex from "@ecom/datasource";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class UserController {
  async getLoggedInUser(req, res) {
    const { id } = req;
    try {
      logger.info(`UserController.getLoggedInUser called :`);
      const data = await UserService.getLoggedInUser({ id });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data: data,
      });
    } catch (error) {
      logger.error(
        `UserController.getLoggedInUser: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new UserController();
