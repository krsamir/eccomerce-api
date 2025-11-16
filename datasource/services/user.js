import { fileURLToPath } from "url";
import { ENVIRONMENT, logger as logs, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class UserService {
  async registerUser({ trx, ...payload }) {
    try {
      logger.info(`UserService.registerUser called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.USER}`)
        .insert(payload)
        .returning("*")
        .transacting(trx);
    } catch (error) {
      logger.error(`
        UserService.registerUser: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async confirmAccount({ email, token }) {
    try {
      logger.info(`UserService.confirmAccount called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.USER}`)
        .select("*")
        .where({
          email,
          token,
        })
        .andWhereRaw("NOW() <= valid_till")
        .first();
    } catch (error) {
      logger.error(`
        UserService.confirmAccount: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async setPassword({ email, password, token }) {
    try {
      logger.info(`UserService.setPassword called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.USER}`)
        .update({
          password,
          token: null,
          valid_till: null,
          is_active: true,
          invalid_logins: 10,
        })
        .where({
          email,
          token,
        })
        .andWhereRaw("NOW() <= valid_till");
    } catch (error) {
      logger.error(`
        UserService.setPassword: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async login({ email }) {
    try {
      logger.info(`UserService.login called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.USER}`)
        .select(["id", "email", "password", "user_name", "invalid_logins"])
        .where({
          is_active: true,
        })
        .andWhere({ user_name: email })
        .orWhere({ email })
        .first();
    } catch (error) {
      logger.error(`
        UserService.login: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async setLoginDetails({ payload, condition }) {
    try {
      logger.info(`UserService.setLoginDetails called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.USER}`)
        .update({
          ...payload,
        })
        .where({ ...condition });
    } catch (error) {
      logger.error(
        `UserService.setLoginDetails: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setTokenForEmailAndValidity({ email = "", payload = {}, trx }) {
    try {
      logger.info(`UserService.setTokenForEmailAndValidity called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.USER}`)
        .update({ ...payload })
        .where({ email })
        .transacting(trx);
    } catch (error) {
      logger.error(
        `UserService.setTokenForEmailAndValidity: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async getLoggedInUser({ id }) {
    const returnObj = {
      id: "id",
      email: "email",
      name: knex.raw(`concat(first_name, ' ',  last_name)`),
      userName: "user_name",
      mobile: "mobile",
    };
    try {
      logger.info(`UserService.getLoggedInUser called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.USER}`)
        .select(returnObj)
        .where({
          id,
          is_active: true,
        })
        .first();
    } catch (error) {
      logger.error(`
        UserService.getLoggedInUser: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new UserService();
