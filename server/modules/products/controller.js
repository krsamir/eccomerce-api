import {
  // checkIsAuthenticatedHandler,
  CONSTANTS,
  ENVIRONMENT,
  logger as logs,
  RESPONSE_STATUS,
  // TRANSFORMERS,
  // transformText,
} from "@ecom/utils";
import { ProductService } from "@ecom/datasource";
import { inspect } from "util";
// import knex from "@ecom/datasource";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class ProductController {
  async getHsnByNameAndCode(req, res) {
    const { name } = req.query;
    console.log("🚀 ~ ProductController ~ getHsnByNameAndCode ~ name:", name);
    try {
      logger.info(`ProductController.getHsnByNameAndCode called :`);
      const data = await ProductService.getHsnByNameAndCode({ name });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data,
      });
    } catch (error) {
      logger.error(`
        ProductController.getHsnByNameAndCode: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new ProductController();
