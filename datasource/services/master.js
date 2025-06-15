import { ENVIRONMENT, logger, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";

class MasterService {
  async setTokenForEmailAndValidity({ email = "", payload = {} }) {
    try {
      logger.info(`MasterService.setTokenForEmailAndValidity called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({ ...payload })
        .where({ email });
    } catch (error) {
      logger.error(
        `MasterService.setTokenForEmailAndValidity: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterService();
