import { CONSTANTS, logger as logs, RESPONSE_STATUS } from "@ecom/utils";
import { CategoriesService } from "@ecom/datasource";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class CategoriesController {
  async createCategory(req, res) {
    const { name, parent_id, rank, is_active, is_favourite } = req.body;
    try {
      logger.info(`CategoriesController.createCategory called :`);
      const data = await CategoriesService.createCategory({
        name,
        parent_id,
        rank,
        is_active,
        is_favourite,
        role: req?.role,
      });
      if (data) {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "",
          status: CONSTANTS.STATUS.SUCCESS,
          data: data?.length > 0 ? data[0] : {},
        });
      }
    } catch (error) {
      logger.error(`
        CategoriesController.createCategory: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getAllCategoriesList(req, res) {
    try {
      logger.info(`CategoriesController.getAllCategoriesList called :`);
      const data = await CategoriesService.getAllCategoriesList({
        role: req?.role,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(
        `CategoriesController.getAllCategoriesList: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async getCategoryById(req, res) {
    try {
      logger.info(`CategoriesController.getCategoryById called :`);
      const data = await CategoriesService.getCategoryById({
        id: req.params.id,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(`
        CategoriesController.getCategoryById: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async updateCategory(req, res) {
    const body = req.body;
    const { id } = req.params;
    try {
      logger.info(`CategoriesController.updateCategory called :`);
      const data = await CategoriesService.updateCategory({
        id,
        role: req?.role,
        ...body,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data
          ? "Category updated succesfully."
          : "Unable to update Category.",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(`
        CategoriesController.updateCategory: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async uploadMedia(req, res) {
    const { id } = req.params;
    const file = req.file;
    try {
      logger.info(`CategoriesController.uploadMedia called :`);
      const data = await CategoriesService.uploadMedia({
        id,
        reqId: req.headers[CONSTANTS.HEADERS.COORELATION_ID],
        file,
        entity_id: req.entityId,
        role: req?.role,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data
          ? "Category uploaded succesfully."
          : "Unable to upload Category.",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(`
        CategoriesController.uploadMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async deleteMedia(req, res) {
    const { id } = req.params;
    try {
      logger.info(`CategoriesController.deleteMedia called :`);
      const data = await CategoriesService.deleteMedia({
        media_id: id,
        reqId: req.headers[CONSTANTS.HEADERS.COORELATION_ID],
        role: req?.role,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data
          ? "Category deleted succesfully."
          : "Unable to delete Category.",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(`
        CategoriesController.deleteMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new CategoriesController();
