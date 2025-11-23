import { CONSTANTS, logger as logs, RESPONSE_STATUS } from "@ecom/utils";
import { UnitService } from "@ecom/datasource";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class UnitController {
  async getAll(req, res) {
    try {
      logger.info(`UnitController.getAll called :`);
      const data = await UnitService.get({ returning: ["id", "name", "type"] });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        count: (data ?? [])?.length,
        data,
      });
    } catch (error) {
      logger.error(`
        UnitController.getAll: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new UnitController();
