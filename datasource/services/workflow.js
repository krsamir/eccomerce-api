import {
  ENVIRONMENT,
  logger as logs,
  CONSTANTS,
  EVENT_NAME,
} from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";
import { fileURLToPath } from "url";
import BullQueue from "@ecom/queue";
import { ProductService } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class WorkflowService {
  async addProductToPublishQueue({ id = "" }) {
    try {
      logger.info(`WorkflowService.addProductToPublishQueue called :`);
      await BullQueue.addToQueue({
        eventName: EVENT_NAME.ADD_PRODUCT_FOR_PUBLISH,
        data: id,
      });
      return true;
    } catch (error) {
      logger.error(`
        WorkflowService.addProductToPublishQueue: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
  async getProductStatus({ id = "" }) {
    console.log("🚀 ~ WorkflowService ~ getProductStatus ~ id:", id);
    try {
      logger.info(`WorkflowService.getProductStatus called :`);
      const baseQuery = knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS}`,
      )
        .where({ uuid: id })
        .select(["master_hash", "is_synced", "updated_at"])
        .first();
      return baseQuery;
    } catch (error) {
      logger.error(`
        WorkflowService.getProductStatus: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new WorkflowService();
