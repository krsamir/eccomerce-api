import { fileURLToPath } from "url";
import {
  ENVIRONMENT,
  logger as logs,
  CONSTANTS,
  TRANSFORMERS,
} from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";
import { ROLES_NAME } from "@ecom/utils/Constants.js";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

const GET_MASTER_SUPER_ADMIN = [
  "master.*",
  "role.id as role_id",
  "role.name as role_name",
];

const GET_ROLES_SUPER_ADMIN = ["*"];
const GET_ROLES_NON_SUPER_ADMIN = ["name"];
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
      logger.error(
        `MasterService.verifyEmailAndToken: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setPasswordWithoutLogin({ email = "", password = "" }) {
    try {
      logger.info(`MasterService.setPasswordWithoutLogin called :`);
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
      logger.error(
        `MasterService.setPasswordWithoutLogin: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async setPasswordWithLogin({ email = "", password = "" }) {
    try {
      logger.info(`MasterService.setPasswordWithLogin called :`);
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
      logger.error(
        `MasterService.setPasswordWithLogin: Error occurred :${inspect(error)}`,
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

  async getAllUsersList({ role }) {
    let returning = GET_MASTER_SUPER_ADMIN;
    if (role === ROLES_NAME.SUPER_ADMIN) {
      returning = GET_MASTER_SUPER_ADMIN;
    }
    try {
      logger.info(`MasterService.getAllUsersList called :`);
      let baseQuery = knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`,
      )
        .select(returning)
        .join(
          CONSTANTS.TABLES.ROLE,
          `${CONSTANTS.TABLES.ROLE}.id`,
          "=",
          `${CONSTANTS.TABLES.MASTER}.role_id`,
        );

      // if (role !== ROLES_NAME.SUPER_ADMIN) {
      //   baseQuery?.where({
      //     "entity.is_active": true,
      //     "entity.is_deleted": false,
      //   });
      // }

      baseQuery.orderBy(`${CONSTANTS.TABLES.MASTER}.created_at`, "desc");

      return baseQuery;
    } catch (error) {
      logger.error(
        `MasterService.getAllUsersList: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async getUserById({ role, id }) {
    let returning = GET_MASTER_SUPER_ADMIN;
    if (role === ROLES_NAME.SUPER_ADMIN) {
      returning = GET_MASTER_SUPER_ADMIN;
    }
    try {
      logger.info(`MasterService.getUserById called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MASTER}`)
        .select(returning)
        .where({ "master.id": id })
        .join(
          CONSTANTS.TABLES.ROLE,
          `${CONSTANTS.TABLES.ROLE}.id`,
          "=",
          `${CONSTANTS.TABLES.MASTER}.role_id`,
        )
        .first();

      // if (role !== ROLES_NAME.SUPER_ADMIN) {
      //   baseQuery?.where({
      //     "entity.is_active": true,
      //     "entity.is_deleted": false,
      //   });
      // }
    } catch (error) {
      logger.error(
        `MasterService.getUserById: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async getAllRoles({ role }) {
    let returning = GET_ROLES_NON_SUPER_ADMIN;
    if (role === ROLES_NAME.SUPER_ADMIN) {
      returning = GET_ROLES_SUPER_ADMIN;
    }
    try {
      logger.info(`MasterService.getAllRoles called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.ROLE}`).select(
        returning,
      );
    } catch (error) {
      logger.error(
        `MasterService.getAllRoles: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterService();
