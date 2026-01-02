import { ENVIRONMENT } from "@ecom/utils";
import Redis from "ioredis";

const redisConfig = {
  host: ENVIRONMENT.REDIS_HOST,
  port: ENVIRONMENT.REDIS_PORT,
};

if (ENVIRONMENT.NODE_ENV !== "development") {
  redisConfig.tls = {};
  redisConfig.password = ENVIRONMENT.REDIS_PASSWORD;
}
export { redisConfig };
export default Redis;
