import { logger } from "@ecom/utils";
import { MasterService } from "@ecom/datasource";
import { inspect } from "util";

class MasterController {
  async getAll(req, res) {
    try {
      logger.info(`MasterController.getAll called :`);
      const data = await MasterService.getAll();
      res.send({ data });
    } catch (error) {
      logger.error(
        `MasterController.getAll: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterController();
