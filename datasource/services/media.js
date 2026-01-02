import {
  ENVIRONMENT,
  logger as logs,
  CONSTANTS,
  axiosInstance,
} from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";
import { fileURLToPath } from "url";
import FormData from "form-data";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class MediaService {
  async postMedia({ file, body, reqId, entityId }) {
    try {
      logger.info(`MediaService.postMedia called :`);
      const form = new FormData();
      form.append("path", `/${body?.productId}`);
      form.append("file", file?.buffer, {
        filename: file.originalname,
      });

      const response = await axiosInstance.post(
        `${ENVIRONMENT.MEDIA_SERVER_HOST}/api/media`,
        form,
        {
          headers: {
            [CONSTANTS.HEADERS.COORELATION_ID]: reqId,
            [CONSTANTS.HEADERS.M_TOKEN]: ENVIRONMENT.MEDIA_SERVICE_TOKEN,
          },
        },
      );
      const media = response?.data?.data;
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MEDIA_DRAFT}`)
        .insert({
          id: media?.id,
          original_name: media?.originalName,
          file_name: media?.fileName,
          path: media?.path,
          size: media?.size,
          mime_type: media?.mimeType,
          sequence: body?.sequence,
          product_id: body?.productId,
          is_draft: true,
          entity_id: entityId,
        })
        .returning(["*"]);
    } catch (error) {
      logger.error(`
        MediaService.postMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getListByProductId({ productId }) {
    try {
      logger.info(`MediaService.getListByProductId called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MEDIA_DRAFT}`)
        .select("*")
        .where({
          product_id: productId,
        });
    } catch (error) {
      logger.error(`
        MediaService.getListByProductId: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async deleteMedia({ id, reqId }) {
    try {
      logger.info(`MediaService.deleteMedia called :`);
      const { data } = await axiosInstance.delete(
        `${ENVIRONMENT.MEDIA_SERVER_HOST}/api/media/${id}`,
        {
          headers: {
            [CONSTANTS.HEADERS.COORELATION_ID]: reqId,
            [CONSTANTS.HEADERS.M_TOKEN]: ENVIRONMENT.MEDIA_SERVICE_TOKEN,
          },
        },
      );
      if (data?.status === CONSTANTS.STATUS.SUCCESS) {
        const stat = await knex(
          `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MEDIA_DRAFT}`,
        )
          .delete()
          .where({
            id,
          });
        return stat === 1;
      }
      return false;
    } catch (error) {
      logger.error(`
        MediaService.deleteMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async updateSequenceofImages({ payload }) {
    try {
      logger.info(`MediaService.updateSequenceofImages called :`);
      const batch = (payload ?? []).map(({ id, sequence }) =>
        knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.MEDIA_DRAFT}`)
          .update({ sequence })
          .where({
            id,
          }),
      );
      return !(await Promise.all(batch)).some((v) => v === 0);
    } catch (error) {
      logger.error(`
        MediaService.updateSequenceofImages: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new MediaService();
