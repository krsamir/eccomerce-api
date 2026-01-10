import { CONSTANTS, logger as logs, RESPONSE_STATUS } from "@ecom/utils";
import { WorkflowService } from "@ecom/datasource";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class WorkflowController {
  async addProductToPublishQueue(req, res) {
    try {
      logger.info(`WorkflowController.addProductToPublishQueue called :`);
      const data = await WorkflowService.addProductToPublishQueue({
        id: req.body,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        count: (data ?? [])?.length,
        data,
      });
    } catch (error) {
      logger.error(`
        WorkflowController.addProductToPublishQueue: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getProductStatus(req, res) {
    try {
      logger.info(`WorkflowController.getProductStatus called :`);
      const data = await WorkflowService.getProductStatus({
        id: req.query.id,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        count: (data ?? [])?.length,
        data,
      });
    } catch (error) {
      logger.error(`
        WorkflowController.getProductStatus: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new WorkflowController();
