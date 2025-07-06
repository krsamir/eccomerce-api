import { ENVIRONMENT, logger as logs, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";
import { ROLES_NAME } from "@ecom/utils/Constants.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class LocationService {
  async getAllLocations({ role }) {
    let returning = ["id", "name", "city", "state", "country"];

    if (ROLES_NAME.SUPER_ADMIN === role) {
      returning = [
        "id",
        "name",
        "city",
        "state",
        "country",
        "is_deleted",
        "created_at",
        "updated_at",
      ];
    }

    try {
      logger.info(`LocationService.getAllLocations called :`);
      const query = knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`,
      ).select(returning);

      if (role !== ROLES_NAME.SUPER_ADMIN) query.where({ is_deleted: false });

      return await query;
    } catch (error) {
      logger.error(
        `LocationService.getAllLocations: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async createLocation({ name, city, state, country, id }) {
    try {
      logger.info(`LocationService.createLocation called :`);
      await knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`,
      ).insert({
        id,
        name,
        city,
        state,
        country,
      });
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`)
        .select("*")
        .where({ id })
        .first();
    } catch (error) {
      logger.error(
        `LocationService.createLocation: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async updateLocation({ name, city, state, country, id, is_deleted }) {
    try {
      logger.info(`LocationService.updateLocation called :`);
      const data = await knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`,
      )
        .update({
          name,
          city,
          state,
          country,
          is_deleted,
        })
        .where({ id });

      if (data) {
        return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`)
          .select("*")
          .where({ id })
          .first();
      } else {
        return data;
      }
    } catch (error) {
      logger.error(
        `LocationService.updateLocation: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async deleteLocation({ id, is_deleted }) {
    try {
      logger.info(`LocationService.deleteLocation called :`);
      const data = await knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`,
      )
        .update({
          is_deleted,
        })
        .where({ id });

      if (data) {
        return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`)
          .select("*")
          .where({ id })
          .first();
      } else {
        return data;
      }
    } catch (error) {
      logger.error(
        `LocationService.deleteLocation: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new LocationService();
