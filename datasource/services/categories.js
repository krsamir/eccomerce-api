import {
  ENVIRONMENT,
  logger as logs,
  CONSTANTS,
  axiosInstance,
} from "@ecom/utils";
import { fileURLToPath } from "url";
import knex from "../knexClient.js";
import { inspect } from "util";
import { ROLES_NAME } from "@ecom/utils/Constants.js";
import RedisService from "../redis/redisService.js";
import FormData from "form-data";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

const GET_ALL_CATEGORIES_RETURNING = ["*"];
const GET_CATEGORIES_NON_ADMIN = [
  "id",
  "name",
  "rank",
  "is_favourite",
  "original_name",
  "file_name",
  "path",
  "size",
  "mime_type",
  "media_id",
];

const GET_CATEGORIES = (role) => `GET_CATEGORIES_${role}`;

class CategoriesService {
  async getAllCategoriesList({ role }) {
    let returning = GET_CATEGORIES_NON_ADMIN;
    if (role === ROLES_NAME.SUPER_ADMIN) {
      returning = GET_ALL_CATEGORIES_RETURNING;
    }
    const key = GET_CATEGORIES(role);

    try {
      logger.info(`CategoriesService.getAllCategoriesList called :`);
      let categories = await RedisService.get(key);

      if (!categories) {
        let baseQuery = knex(
          `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.CATEGORIES_DRAFT}`,
        ).select(returning);
        // .join(
        //   CONSTANTS.TABLES.LOCATION,
        //   `${CONSTANTS.TABLES.ENTITY}.location_id`,
        //   "=",
        //   `${CONSTANTS.TABLES.LOCATION}.id`,
        // );

        if (role !== ROLES_NAME.SUPER_ADMIN) {
          baseQuery?.where({
            is_active: true,
          });
        }

        baseQuery.orderBy(
          `${CONSTANTS.TABLES.CATEGORIES_DRAFT}.created_at`,
          "desc",
        );

        const result = await baseQuery;
        await RedisService.set(key, result);
        categories = result;
      }

      return categories;
      // .map((item) =>
      //   TRANSFORMERS.entityLocationTransformers(item),
      // );
    } catch (error) {
      logger.error(
        `CategoriesService.getAllCategoriesList: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async createCategory({
    name,
    parent_id,
    rank,
    is_active,
    is_favourite,
    role,
  }) {
    try {
      logger.info(`CategoriesService.createCategory called :`);
      const key = GET_CATEGORIES(role);

      await RedisService.delete(key);

      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.CATEGORIES_DRAFT}`,
      )
        .insert({ name, parent_id, rank, is_active, is_favourite })
        .returning("id");
    } catch (error) {
      logger.error(`
        CategoriesService.createCategory: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getCategoryById({ id }) {
    try {
      logger.info(`CategoriesService.getCategoryById called :`);
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.CATEGORIES_DRAFT}`,
      )
        .where({ id })
        .returning("*")
        .first();
    } catch (error) {
      logger.error(`
        CategoriesService.getCategoryById: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async updateCategory({ id, role, ...rest }) {
    try {
      logger.info(`CategoriesService.updateCategory called :`);
      const key = GET_CATEGORIES(role);
      await RedisService.delete(key);
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.CATEGORIES_DRAFT}`,
      )
        .where({ id })
        .update({ ...rest });
    } catch (error) {
      logger.error(`
        CategoriesService.updateCategory: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async uploadMedia({ id, file, entity_id, reqId, role }) {
    try {
      logger.info(`CategoriesService.uploadMedia called :`);
      const key = GET_CATEGORIES(role);
      await RedisService.delete(key);

      const form = new FormData();
      form.append("path", `/${entity_id}/category`);
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
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.CATEGORIES_DRAFT}`,
      )
        .update({
          original_name: media?.originalName,
          file_name: media?.fileName,
          path: media?.path,
          size: media?.size,
          mime_type: media?.mimeType,
          entity_id,
          media_id: media?.id,
        })
        .where({ id })
        .returning(["*"]);
    } catch (error) {
      logger.error(`
        CategoriesService.uploadMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async deleteMedia({ role, reqId, media_id }) {
    try {
      logger.info(`CategoriesService.deleteMedia called :`);
      const key = GET_CATEGORIES(role);
      await RedisService.delete(key);

      const { data } = await axiosInstance.delete(
        `${ENVIRONMENT.MEDIA_SERVER_HOST}/api/media/${media_id}`,
        {
          headers: {
            [CONSTANTS.HEADERS.COORELATION_ID]: reqId,
            [CONSTANTS.HEADERS.M_TOKEN]: ENVIRONMENT.MEDIA_SERVICE_TOKEN,
          },
        },
      );
      if (data?.status === CONSTANTS.STATUS.SUCCESS) {
        const stat = await knex(
          `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.CATEGORIES_DRAFT}`,
        )
          .update({
            original_name: null,
            file_name: null,
            path: null,
            size: null,
            mime_type: null,
            media_id: null,
          })
          .where({
            media_id,
          });
        return stat === 1;
      }
      return false;
    } catch (error) {
      logger.error(`
        CategoriesService.deleteMedia: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new CategoriesService();
