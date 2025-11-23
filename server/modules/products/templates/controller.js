import { CONSTANTS, logger as logs, RESPONSE_STATUS } from "@ecom/utils";
import { TemplatesService } from "@ecom/datasource";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class TemplatesController {
  async getAll(req, res) {
    try {
      logger.info(`TemplatesController.getAll called :`);
      const data = await TemplatesService.get({
        returning: ["id", "name", "content"],
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        count: (data ?? [])?.length,
        data,
      });
    } catch (error) {
      logger.error(`
        TemplatesController.getAll: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new TemplatesController();
