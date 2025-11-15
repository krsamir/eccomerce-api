import Knex from "knex";
import { ENVIRONMENT } from "@ecom/utils";

const knex = Knex({
  client: ENVIRONMENT.KNEX_CLIENT,
  connection: {
    database: ENVIRONMENT.KNEX_DATABASE,
    user: ENVIRONMENT.KNEX_USERNAME,
    password: ENVIRONMENT.KNEX_PASSWORD,
    host: ENVIRONMENT.KNEX_HOST,
  },
  searchPath: [ENVIRONMENT.KNEX_SCHEMA],
  pool: { min: 2, max: 10 },
});

export default knex;
