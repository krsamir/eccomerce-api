import { fileURLToPath } from "url";
import { ENVIRONMENT, logger as logs, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class UserService {
  async getLoggedInUser({ id }) {
    const returnObj = {
      id: "id",
      email: "email",
      name: knex.raw(`concat(first_name, ' ',  last_name)`),
      userName: "user_name",
    };
    try {
      logger.info(`UserService.getLoggedInUser called :`);
      let baseQuery = knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`,
      )
        .select(returnObj)
        .where({ id })
        .first();

      return baseQuery;
    } catch (error) {
      logger.error(
        `UserService.getLoggedInUser: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new UserService();
