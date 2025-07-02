import { ENVIRONMENT, logger, CONSTANTS } from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";

class LocationService {
  async getAllLocations() {
    try {
      logger.info(`LocationService.getAllLocations called :`);
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`,
      ).select();
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
