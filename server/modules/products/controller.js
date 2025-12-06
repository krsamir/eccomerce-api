import {
  // checkIsAuthenticatedHandler,
  CONSTANTS,
  ENVIRONMENT,
  logger as logs,
  RESPONSE_STATUS,
  // TRANSFORMERS,
  // transformText,
} from "@ecom/utils";
import knex, { ProductService } from "@ecom/datasource";
import { inspect } from "util";
// import knex from "@ecom/datasource";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class ProductController {
  async getStocksMetadata(req, res) {
    const { entityId } = req;
    try {
      logger.info(`ProductController.getStocksMetadata called :`);
      const data = await ProductService.getStocksMetadata({ entityId });
      if (data) {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "",
          status: CONSTANTS.STATUS.SUCCESS,
          data,
        });
      }
    } catch (error) {
      logger.error(`
        ProductController.getStocksMetadata: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async createProduct(req, res) {
    const body = req.body;
    const { entityId, id } = req;
    const trx = await knex.transaction();
    try {
      logger.info(`ProductController.createProduct called :`);
      const data = await ProductService.createProduct({
        body,
        entityId,
        id,
        trx,
      });
      if (data) {
        trx.commit();
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "Product Created.",
          status: CONSTANTS.STATUS.SUCCESS,
          data,
        });
      }
    } catch (error) {
      trx.rollback();
      logger.error(`
        ProductController.createProduct: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      logger.info(`ProductController.getProductById called :`);
      const data = await ProductService.getProductById({ id });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data ? "" : `Product with ${id} does not exist.`,
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
        data,
      });
    } catch (error) {
      logger.error(`
        ProductController.getProductById: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
  async getAllProducts(req, res) {
    const { page } = req.query;
    const { filter } = req.body;
    try {
      logger.info(`ProductController.getAllProducts called :`);
      const data = await ProductService.getAllProducts({ page, filter });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(`
        ProductController.getAllProducts: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getAllProductMetaData(req, res) {
    try {
      logger.info(`ProductController.getAllProductMetaData called :`);
      let count = 0;
      const data = await ProductService.getAllProductMetaData();
      if (data?.[0]?.count) {
        count = Number(data?.[0]?.count);
      }

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data: count,
      });
    } catch (error) {
      logger.error(`
        ProductController.getAllProductMetaData: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new ProductController();
