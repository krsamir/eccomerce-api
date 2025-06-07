import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const ENVIRONMENT = Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? 5000,
  KNEX_USERNAME: process.env.KNEX_USERNAME,
  KNEX_HOST: process.env.KNEX_HOST,
  KNEX_PASSWORD: process.env.KNEX_PASSWORD,
  KNEX_SCHEMA: process.env.KNEX_SCHEMA,
  KNEX_CLIENT: process.env.KNEX_CLIENT,
});

export default ENVIRONMENT;
