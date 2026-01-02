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

  async getListByProductId(req, res) {
    try {
      const { productId } = req.params;
      logger.info(`MediaController.getListByProductId called :`);
      const data = await MediaService.getListByProductId({ productId });
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
        MediaController.getListByProductId: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      logger.info(`MediaController.deleteMedia called :`);
      const data = await MediaService.deleteMedia({
        id,
        reqId: req.headers[CONSTANTS.HEADERS.COORELATION_ID],
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data
          ? "Media Deleted succesfully."
          : "Unable to delete Media.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
        data,
        keepSnakeCase: true,
      });
    } catch (error) {
      logger.error(`
        MediaController.deleteMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async updateSequenceofImages(req, res) {
    try {
      const body = req.body;
      logger.info(`MediaController.updateSequenceofImages called :`);
      const data = await MediaService.updateSequenceofImages({
        payload: body,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data ? "Order saved." : "Unable to save order of media.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
        data,
        keepSnakeCase: true,
      });
    } catch (error) {
      logger.error(`
        MediaController.updateSequenceofImages: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new MediaController();
