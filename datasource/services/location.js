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

  async createLocation({ name, city, state, country }) {
    try {
      logger.info(`LocationService.createLocation called :`);
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.LOCATION}`,
      ).insert({
        name,
        city,
        state,
        country,
      });
    } catch (error) {
      logger.error(
        `LocationService.createLocation: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new LocationService();
