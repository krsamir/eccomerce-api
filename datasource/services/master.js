import { ENVIRONMENT, logger, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";

class MasterService {
  async setTokenForEmailAndValidity({ email = "", payload = {}, trx }) {
    try {
      logger(__filename).info(
        `MasterService.setTokenForEmailAndValidity called :`,
      );
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({ ...payload })
        .where({ email })
        .transacting(trx);
    } catch (error) {
      logger(__filename).error(
        `MasterService.setTokenForEmailAndValidity: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async verifyEmailAndToken({ email = "", token = "" }) {
    try {
      logger(__filename).info(`MasterService.verifyEmailAndToken called :`);
      const now = new Date();
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({
          is_active: true,
          valid_till: new Date(
            now.getTime() +
              CONSTANTS.AUTHENTICATION.TOKEN_VALIDITY_IN_MINS * 60 * 1000,
          ),
          token: CONSTANTS.AUTHENTICATION.PASSWORD_CHANGE_TOKEN,
          invalid_logins: CONSTANTS.AUTHENTICATION.NO_OF_INVALID_LOGINS_COUNT,
        })
        .where({
          email,
          token,
          is_deleted: false,
        })
        .andWhereRaw("NOW() <= valid_till");
    } catch (error) {
      logger(__filename).error(
        `MasterService.verifyEmailAndToken: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setPasswordWithoutLogin({ email = "", password = "" }) {
    try {
      logger(__filename).info(`MasterService.setPasswordWithoutLogin called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({
          is_active: true,
          valid_till: null,
          token: null,
          invalid_logins: CONSTANTS.AUTHENTICATION.NO_OF_INVALID_LOGINS_COUNT,
          password,
        })
        .where({
          email,
          token: CONSTANTS.AUTHENTICATION.PASSWORD_CHANGE_TOKEN,
          is_deleted: false,
        })
        .andWhereRaw("NOW() <= valid_till");
    } catch (error) {
      logger(__filename).error(
        `MasterService.setPasswordWithoutLogin: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setPasswordWithLogin({ email = "", password = "" }) {
    try {
      logger(__filename).info(`MasterService.setPasswordWithLogin called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({
          invalid_logins: CONSTANTS.AUTHENTICATION.NO_OF_INVALID_LOGINS_COUNT,
          is_active: true,
          valid_till: null,
          token: null,
          password,
        })
        .where({
          email,
          is_deleted: false,
        });
    } catch (error) {
      logger(__filename).error(
        `MasterService.setPasswordWithLogin: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async getUserByEmail({ email = "", user_name = "" }) {
    try {
      logger(__filename).info(`MasterService.getUserByEmail called :`);
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
      logger(__filename).error(
        `MasterService.getUserByEmail: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setLoginDetails({ payload, condition }) {
    try {
      logger(__filename).info(`MasterService.setLoginDetails called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .update({
          ...payload,
        })
        .where({ ...condition });
    } catch (error) {
      logger(__filename).error(
        `MasterService.setLoginDetails: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterService();
