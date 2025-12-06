import {
  ENVIRONMENT,
  logger as logs,
  CONSTANTS,
  toSnakeCase,
} from "@ecom/utils";
import knex from "../knexClient.js";
import { inspect } from "util";
// import { ROLES_NAME } from "@ecom/utils/Constants.js";
import { fileURLToPath } from "url";
import { Product } from "@ecom/models";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class ProductService {
  create({ payload = {}, returning = null }) {
    const baseQuery = knex(
      `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS_DRAFT}`,
    ).insert({ ...payload });

    if (returning) {
      baseQuery?.returning(returning);
    }

    return baseQuery;
  }

  update({ payload = {}, where = {}, returning = null }) {
    const baseQuery = knex(
      `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS_DRAFT}`,
    )
      .update({ ...payload })
      .where({ ...where });

    if (returning) {
      baseQuery?.returning(returning);
    }

    return baseQuery;
  }

  delete({ shouldDelete = true, where = {}, returning = null }) {
    const baseQuery = knex(
      `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS_DRAFT}`,
    )
      .update({ is_deleted: shouldDelete })
      .where({ ...where });

    if (returning) {
      baseQuery?.returning(returning);
    }

    return baseQuery;
  }

  get({ where = {}, returning = "*" }) {
    const isWhereAvailable = Object.entries(where)?.length > 0;

    const baseQuery = knex(
      `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS_DRAFT}`,
    ).select(returning);

    if (isWhereAvailable) {
      baseQuery?.where({ ...where });
    }

    return baseQuery;
  }

  async getStocksMetadata({ entityId }) {
    try {
      logger.info(`ProductService.getStocksMetadata called :`);
      return knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.STOCKS_DRAFT}`)
        .select({ source: "source", supplierName: "supplier_name" })
        .where({ entity_id: entityId });
    } catch (error) {
      logger.error(`
        ProductService.getStocksMetadata: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async createProduct({ body, entityId, id, trx }) {
    let { costs: costsPayload, stock: stockPayload, ...productPayload } = body;
    const metadata = { entity_id: entityId, created_by: id };

    productPayload = { ...productPayload, ...metadata };

    try {
      logger.info(`ProductService.createProduct called :`);
      let data = await this.create({
        payload: productPayload,
        returning: "*",
      }).transacting(trx);

      data = data?.[0] ?? {};

      const product = new Product({ ...data });

      stockPayload = {
        ...stockPayload,
        ...metadata,
        product_id: product?.get()?.id,
      };
      const baseCostQuery = knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.COSTS_DRAFT}`,
      );

      let [version] = await baseCostQuery
        // .max(`COALESCE(MAX(version), 0) + 1 as maxVersion`)
        .max("version")
        .where({ product_id: product?.get()?.id });

      version = version?.max + 1;

      costsPayload = costsPayload.map((v) => ({
        ...v,
        ...metadata,
        product_id: product?.get()?.id,
        version,
      }));

      const resolver = [
        knex(`${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.STOCKS_DRAFT}`)
          .insert({ ...stockPayload })
          .returning("*")
          .transacting(trx),
        baseCostQuery.insert(costsPayload).returning("*").transacting(trx),
      ];

      const [stock, costs] = await Promise.all(resolver);

      return { ...product.get(), stock: stock?.[0] ?? {}, costs };
    } catch (error) {
      logger.error(`
        ProductService.createProduct: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getAllProductMetaData() {
    try {
      logger.info(`ProductService.getAllProductMetaData called :`);
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS_DRAFT}`,
      ).count();
    } catch (error) {
      logger.error(`
        ProductService.getAllProductMetaData: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getAllProducts({ page, filter }) {
    page = Number.isNaN(page) ? 1 : page < 1 ? 1 : page;
    const offset = (page - 1) * CONSTANTS.PER_PAGE_NUMBER_OF_ROWS;
    try {
      logger.info(`ProductService.getAllProducts called :`);
      const query = knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS_DRAFT}`,
      )
        .select([
          "barcode",
          "hindi_name",
          "is_active",
          "is_deleted",
          "name",
          "unit",
          "unit_type",
          "uuid",
        ])
        .orderBy("updated_at", "desc")
        .limit(CONSTANTS.PER_PAGE_NUMBER_OF_ROWS)
        .offset(offset);

      if (filter.length > 0) {
        filter.map(({ type, col, value }) => {
          if (type === "TEXT_FILTER") {
            if (col === "unit" || col === "uuid") {
              query.orWhere(toSnakeCase(col), value);
            } else {
              query.orWhereILike(toSnakeCase(col), `%${value}%`);
            }
          }
          if (type === "EXACT_MATCH" || type === "BOOLEAN_FILTER") {
            query.orWhere(toSnakeCase(col), value);
          }
        });
      }
      console.info(query.toQuery());
      return query;
    } catch (error) {
      logger.error(`
        ProductService.getAllProducts: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async getProductById({ id }) {
    try {
      logger.info(`ProductService.getProductById called :`);
      return knex(
        `${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.PRODUCTS_DRAFT} as p`,
      )
        .select([
          "p.name",
          "p.hindi_name",
          "p.uuid",
          "p.description",
          "p.barcode",
          "p.unit",
          "p.unit_type",
          "p.is_active",
          "p.is_deleted",
          "p.updated_at",
          knex.raw(`
      (
        SELECT json_agg(
                 json_build_object(
                   'costId', cd.id,
                   'min_qty', cd.min_qty,
                   'max_qty', cd.max_qty,
                   'purchase_cost', cd.purchase_cost,
                   'cost_for_sell', cd.cost_for_sell,
                   'actual_cost', cd.actual_cost,
                   'currency', cd.currency,
                   'valid_from', cd.valid_from,
                   'valid_to', cd.valid_to,
                   'version', cd.version,
                   'created_at', cd.created_at
                 )
               )
        FROM ${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.COSTS_DRAFT} cd
        WHERE cd.product_id = p.id
          AND cd.version = (
                SELECT MAX(version)
                FROM ${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.COSTS_DRAFT}
                WHERE product_id = p.id
              )
      ) AS costs
    `),
          knex.raw(`
      (
        SELECT json_build_object(
        'id', sd.id,
        'quantity_available', sd.quantity_available,
        'reorder_level', sd.reorder_level,
        'supplier_name', sd.supplier_name,
        'source', sd.source,
        'created_at', sd.created_at
        )
        FROM ${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.STOCKS_DRAFT} sd
        WHERE sd.product_id = p.id
        ORDER BY sd.created_at DESC
        LIMIT 1
      ) AS stock
    `),
          knex.raw(`
      (
        SELECT json_build_object(
        'id', hs.id,
        'hsn_code', hs.hsn_code,
        'hsn_description', hs.hsn_description
        )
        FROM ${ENVIRONMENT.KNEX_SCHEMA}.${CONSTANTS.TABLES.HSNS} hs
        WHERE p.hsn_id = hs.id
      ) AS hsn
    `),
        ])
        .where({
          uuid: id,
        })
        .first();
    } catch (error) {
      logger.error(`
        ProductService.getProductById: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }
}

export default new ProductService();
