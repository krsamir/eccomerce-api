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
          is_deleted: false,
        })
        .andWhereRaw("NOW() <= valid_till");
    } catch (error) {
      logger.error(
        `MasterService.verifyEmailAndToken: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setPasswordWithoutLogin({ email = "", password = "" }) {
    try {
      logger.info(`MasterService.setPassword called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({
          is_active: true,
          valid_till: null,
          token: null,
          invalid_logins: 10,
          password,
        })
        .where({
          email,
          token: "PCW",
          is_deleted: false,
        })
        .andWhereRaw("NOW() <= valid_till");
    } catch (error) {
      logger.error(
        `MasterService.setPassword: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async getUserByEmail({ email = "", user_name = "" }) {
    try {
      logger.info(`MasterService.getUserByEmail called :`);
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER} as master`,
      )
        .select([
          "master.id as id",
          "email",
          "password",
          "user_name",
          "invalid_logins",
          "role_id",
          "role.name as role_name",
        ])
        .where({
          is_active: true,
          "master.is_deleted": false,
        })
        .andWhere({ user_name })
        .orWhere({ email })
        .first()
        .join("role as role", "role.id", "master.role_id");
    } catch (error) {
      logger.error(
        `MasterService.getUserByEmail: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setLoginDetails({ payload, condition }) {
    try {
      logger.info(`MasterService.setLoginDetails called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({
          ...payload,
        })
        .where({ ...condition });
    } catch (error) {
      logger.error(
        `MasterService.setLoginDetails: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterService();
