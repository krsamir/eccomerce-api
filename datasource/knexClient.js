import Knex from "knex";
import { ENVIRONMENT } from "@ecom/utils";

const knex = Knex({
  client: ENVIRONMENT.KNEX_CLIENT,
  connection: {
    database: ENVIRONMENT.KNEX_SCHEMA,
    user: ENVIRONMENT.KNEX_USERNAME,
    password: ENVIRONMENT.KNEX_PASSWORD,
    host: ENVIRONMENT.KNEX_HOST,
  },
  pool: { min: 2, max: 10 },
});

export default knex;
