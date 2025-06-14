import { ENVIRONMENT, logger, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";

class MasterService {
  async getAll() {
    try {
      logger.info(`MasterService.getAll called :`);
      return knex
        .select()
        .from(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`);
    } catch (error) {
      logger.error(`MasterService.getAll: Error occurred :${inspect(error)}`);
      throw error;
    }
  }
}

export default new MasterService();
