import { ENVIRONMENT, logger, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";

class MasterService {
  async setTokenForEmailAndValidity({ email = "", payload = {}, trx }) {
    try {
      logger.info(`MasterService.setTokenForEmailAndValidity called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({ ...payload })
        .where({ email })
        .transacting(trx);
    } catch (error) {
      logger.error(
        `MasterService.setTokenForEmailAndValidity: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async verifyEmailAndToken({ email = "", token = "" }) {
    try {
      logger.info(`MasterService.verifyEmailAndToken called :`);
      const now = new Date();
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({
          is_active: true,
          valid_till: new Date(now.getTime() + 10 * 60 * 1000),
          token: "PCW",
          invalid_logins: 10,
        })
        .where({
          email,
          token,
        })
        .andWhereRaw("NOW() <= valid_till");
    } catch (error) {
      logger.error(
        `MasterService.verifyEmailAndToken: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterService();
