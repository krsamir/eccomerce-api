import {
  ENVIRONMENT,
  logger as logs,
  CONSTANTS,
  TRANSFORMERS,
} from "@ecom/utils";
import { fileURLToPath } from "url";
import knex from "../knexClient.js";
import { inspect } from "util";
import { ROLES_NAME } from "@ecom/utils/Constants.js";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

const GET_ALL_ENTITY_RETURNING = [
  "entity.*",
  "location.id as location_id",
  "location.name as location_name",
  "location.city as city",
  "location.state as state",
  "location.country as country",
  "location.id as location_id",
];
const GET_ENTITY_NON_ADMIN = [
  "entity.id",
  "entity.name",
  "entity.gst",
  "entity.address",
  "entity.proprietor_name",
  "entity.max_admin",
  "entity.max_manager",
  "entity.categories",
  "location.id as location_id",
  "location.name as location_name",
  "location.city as city",
  "location.state as state",
  "location.country as country",
  "location.id as location_id",
];
class EntitiesService {
  async getEntityById({ id, role, location_id }) {
    let returning = GET_ENTITY_NON_ADMIN;
    if (role === ROLES_NAME.SUPER_ADMIN) {
      returning = GET_ALL_ENTITY_RETURNING;
    }
    let baseQuery = knex(
      `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.ENTITY}`,
    ).select(returning);
    if (role !== ROLES_NAME.SUPER_ADMIN) {
      baseQuery?.where({
        "entity.is_active": true,
        "entity.is_deleted": false,
      });
    }
    if (id) {
      baseQuery = baseQuery.where({ "entity.id": id });
    }
    if (location_id) {
      baseQuery = baseQuery.where({ "entity.location_id": location_id });
    }
    baseQuery.join(
      CONSTANTS.TABLES.LOCATION,
      `${CONSTANTS.TABLES.ENTITY}.location_id`,
      "=",
      `${CONSTANTS.TABLES.LOCATION}.id`,
    );

    if (id) {
      baseQuery.first();
    }

    return await baseQuery;
  }

  async createEntity({
    name,
    id,
    gst,
    address,
    location_id,
    proprietor_name,
    categories,
    created_by,
  }) {
    try {
      logger.info(`EntitiesService.createEntity called :`);
      await knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.ENTITY}`,
      ).insert({
        id,
        name,
        gst,
        address,
        location_id,
        proprietor_name,
        categories,
        created_by,
        is_active: true,
      });
      const result = await this.getEntityById({ id });
      return TRANSFORMERS.entityLocationTransformers(result);
    } catch (error) {
      logger.error(
        `EntitiesService.createEntity: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async getAllEntitiesList({ role }) {
    let returning = GET_ENTITY_NON_ADMIN;
    if (role === ROLES_NAME.SUPER_ADMIN) {
      returning = GET_ALL_ENTITY_RETURNING;
    }
    try {
      logger.info(`EntitiesService.getAllEntitiesList called :`);
      let baseQuery = knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.ENTITY}`,
      )
        .select(returning)
        .join(
          CONSTANTS.TABLES.LOCATION,
          `${CONSTANTS.TABLES.ENTITY}.location_id`,
          "=",
          `${CONSTANTS.TABLES.LOCATION}.id`,
        );

      if (role !== ROLES_NAME.SUPER_ADMIN) {
        baseQuery?.where({
          "entity.is_active": true,
          "entity.is_deleted": false,
        });
      }

      baseQuery.orderBy(`${CONSTANTS.TABLES.ENTITY}.created_at`, "desc");

      const result = await baseQuery;
      return result.map((item) =>
        TRANSFORMERS.entityLocationTransformers(item),
      );
    } catch (error) {
      logger.error(
        `EntitiesService.getAllEntitiesList: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async updateEntity(entity, id) {
    try {
      logger.info(`EntitiesService.updateEntity called :`);
      const data = await knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.ENTITY}`,
      )
        .update({
          ...entity,
        })
        .where({ id });

      if (data) {
        const result = await this.getEntityById({ id });
        return TRANSFORMERS.entityLocationTransformers(result);
      } else {
        return data;
      }
    } catch (error) {
      logger.error(
        `EntitiesService.updateEntity: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }

  async deleteEntity({ id, is_deleted }) {
    try {
      logger.info(`EntitiesService.deleteEntity called :`);
      const data = await knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.ENTITY}`,
      )
        .update({
          is_deleted,
        })
        .where({ id });

      if (data) {
        const result = await this.getEntityById({ id });
        return TRANSFORMERS.entityLocationTransformers(result);
      } else {
        return data;
      }
    } catch (error) {
      logger.error(
        `EntitiesService.deleteEntity: Error occurred :${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new EntitiesService();
