import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const ENVIRONMENT = Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? 5000,
  KNEX_USERNAME: process.env.KNEX_USERNAME,
  KNEX_HOST: process.env.KNEX_HOST,
  KNEX_PASSWORD: process.env.KNEX_PASSWORD,
  KNEX_SCHEMA: process.env.KNEX_SCHEMA,
  KNEX_CLIENT: process.env.KNEX_CLIENT,
  SENDER: process.env.SENDER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  NODE_HOST_NAME: process.env.NODE_HOST_NAME,
  CLIENT_URL: process.env.CLIENT_URL,
  SEND_EMAILS: process.env.SEND_EMAILS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
});

export default ENVIRONMENT;
