import { CONSTANTS, logger as logs, RESPONSE_STATUS } from "@ecom/utils";
import { MediaService } from "@ecom/datasource";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class MediaController {
  async postMedia(req, res) {
    try {
      logger.info(`MediaController.postMedia called :`);
      const data = await MediaService.postMedia({
        file: req.file,
        body: req.body,
        reqId: req.headers[CONSTANTS.HEADERS.COORELATION_ID],
        entityId: req.entityId,
      });
      if (data) {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "",
          status: CONSTANTS.STATUS.SUCCESS,
          data,
          keepSnakeCase: true,
        });
      }
    } catch (error) {
      logger.error(`
        MediaController.postMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new MediaController();
