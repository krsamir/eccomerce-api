import { CONSTANTS, logger as logs, RESPONSE_STATUS } from "@ecom/utils";
import { HSNService } from "@ecom/datasource";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class HSNController {
  async getHsnByNameAndCode(req, res) {
    const { name } = req.query;
    console.log("🚀 ~ HSNController ~ getHsnByNameAndCode ~ name:", name);
    try {
      logger.info(`HSNController.getHsnByNameAndCode called :`);
      const data = await HSNService.getHsnByNameAndCode({ name });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        count: data?.length,
        data,
      });
    } catch (error) {
      logger.error(`
        HSNController.getHsnByNameAndCode: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new HSNController();
