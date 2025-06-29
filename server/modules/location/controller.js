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
      const data = await LocationService.createLocation({
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
}

export default new LocationController();
