import { CONSTANTS, logger, RESPONSE_STATUS } from "@ecom/utils";
import { EntitiesService } from "@ecom/datasource";
import { inspect } from "util";

class EntitiesController {
  async createEntity(req, res) {
    const { name, gst, address, location_id, proprietor_name, categories } =
      req.body;
    try {
      logger.info(`EntitiesController.createEntity called :`);
      // id needs to be created manually as uuid is not returned via knex in mysql
      const id = crypto.randomUUID();
      const data = await EntitiesService.createEntity({
        id,
        name,
        gst,
        address,
        location_id,
        proprietor_name,
        categories: JSON.stringify(categories),
        created_by: req?.id,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "Entity Added!",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(
        `EntitiesController.createEntity: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async getAllEntitiesList(req, res) {
    try {
      logger.info(`EntitiesController.getAllEntitiesList called :`);
      const data = await EntitiesService.getAllEntitiesList({
        role: req?.role,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(
        `EntitiesController.getAllEntitiesList: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async updateEntity(req, res) {
    const { delete: is_deleted, ...entity } = req.body;

    const { id } = req.params;
    try {
      logger.info(`EntitiesController.updateEntity called :`);
      const data = await EntitiesService.updateEntity(
        {
          ...entity,
          categories: JSON.stringify(entity.categories),
          is_deleted,
        },
        id,
      );
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data ? "Entity updated!" : "Unable to update Entity.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
        data: data ? data : undefined,
      });
    } catch (error) {
      logger.error(
        `EntitiesController.updateEntity: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async deleteEntity(req, res) {
    const { id } = req.params;
    try {
      logger.info(`EntitiesController.deleteEntity called :`);
      const data = await EntitiesService.deleteEntity({
        id,
        is_deleted: true,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data ? "Entity deleted!" : "Unable to delete Entity.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
        data: data ? data : undefined,
      });
    } catch (error) {
      logger.error(
        `EntitiesController.deleteEntity: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async getEntityByID(req, res) {
    try {
      logger.info(`EntitiesController.getEntityByID called :`);
      const { id } = req.params;
      const data = await EntitiesService.getEntityById({
        id,
        role: req.role,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data ? "" : "Entity not Found!",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(
        `EntitiesController.getEntityByID: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async getEntityByLocationId(req, res) {
    try {
      logger.info(`EntitiesController.getEntityByLocationId called :`);
      const { id } = req.params;
      const data = await EntitiesService.getEntityById({
        location_id: id,
        role: req.role,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(
        `EntitiesController.getEntityByLocationId: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new EntitiesController();
