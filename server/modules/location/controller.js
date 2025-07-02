import {
  checkIsAuthenticated,
  CONSTANTS,
  ENVIRONMENT,
  logger,
  RESPONSE_STATUS,
} from "@ecom/utils";
import { LocationService } from "@ecom/datasource";
import { inspect } from "util";

class LocationController {
  async getAllLocations(req, res) {
    try {
      logger.info(`LocationController.getAllLocations called :`);
      const data = await LocationService.getAllLocations();
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(
        `LocationController.getAllLocations: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async createLocation(req, res) {
    const { name, city, state, country } = req.body;
    try {
      logger.info(`LocationController.createLocation called :`);
      // id needs to be created manually as uuid is not returned via knex in mysql
      const id = crypto.randomUUID();
      const data = await LocationService.createLocation({
        id,
        name,
        city,
        state,
        country,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "Location Added!",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(
        `LocationController.createLocation: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async updateLocation(req, res) {
    const { id, name, city, state, country, delete: is_deleted } = req.body;
    try {
      logger.info(`LocationController.updateLocation called :`);
      const data = await LocationService.updateLocation({
        id,
        name,
        city,
        state,
        country,
        is_deleted,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data ? "Location updated!" : "Unable to update location.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
        data: data ? data : undefined,
      });
    } catch (error) {
      logger.error(
        `LocationController.updateLocation: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async deleteLocation(req, res) {
    const { id } = req.query;
    try {
      logger.info(`LocationController.deleteLocation called :`);
      const data = await LocationService.deleteLocation({
        id,
        is_deleted: true,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data ? "Location deleted!" : "Unable to delete location.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
        data: data ? data : undefined,
      });
    } catch (error) {
      logger.error(
        `LocationController.deleteLocation: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new LocationController();
