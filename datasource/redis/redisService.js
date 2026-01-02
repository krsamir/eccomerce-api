import { ENVIRONMENT, logger as logs } from "@ecom/utils";
import Redis, { redisConfig } from "./redis-config.js";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class RedisService {
  redisInstance = null;

  isHealthy = false;

  static getInstance() {
    if (!this.redisInstance) {
      this.redisInstance = new Redis({
        ...redisConfig,
        retryStrategy(times) {
          console.log("🚀 ~ RedisService ~ getInstance ~ times:", times);
          if (times >= 2) {
            return null;
          }
          return Math.min(times * 200, 2000);
        },
      });
      this.redisInstance.on("connect", () => {
        console.log("Redis connected");
      });

      this.redisInstance.on("ready", () => {
        console.log("Redis ready");
        RedisService.isHealthy = true;
      });

      this.redisInstance.on("error", (err) => {
        console.error("Redis connection error:", err);
        RedisService.isHealthy = false;
      });

      this.redisInstance.on("close", () => {
        console.warn("Redis connection closed");
        RedisService.isHealthy = false;
      });

      this.redisInstance.on("reconnecting", (delay) => {
        console.warn(`Redis reconnecting in ${delay}ms`);
      });

      this.redisInstance.id = crypto.randomUUID()?.slice(0, 7);
    }

    logger.info(
      `🚀 ~ RedisService ~  this.redisInstance ~ instance id: ${this.redisInstance?.id}`,
    );
    return this.redisInstance;
  }

  static async get(key) {
    if (!this.redisInstance || !this.isHealthy) {
      return null;
    }
    try {
      logger.info(`RedisService.get ${this.redisInstance.id} called :${key}`);
      const value = await this.redisInstance.get(
        `${ENVIRONMENT.NODE_ENV}_${key}`,
      );
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`RedisService.get: Error occurred :${inspect(error)}`);
      // throw error;
    }
  }
  static async set(key, value, expiry = 3600) {
    try {
      if (!this.redisInstance || !this.isHealthy) {
        return;
      }
      logger.info(`RedisService.set ${this.redisInstance.id} called :${key}`);
      await this.redisInstance.set(
        `${ENVIRONMENT.NODE_ENV}_${key}`,
        JSON.stringify(value),
        "EX",
        expiry,
      );
    } catch (error) {
      logger.error(`RedisService.set: Error occurred :${inspect(error)}`);
      return null;
      // throw error;
    }
  }

  static async delete(key) {
    if (!this.redisInstance || !this.isHealthy) {
      return;
    }
    try {
      logger.info(
        `RedisService.delete ${this.redisInstance.id} called :${key}`,
      );
      const result = await this.redisInstance.del(
        `${ENVIRONMENT.NODE_ENV}_${key}`,
      );
      return result === "OK";
    } catch (error) {
      logger.error(`RedisService.delete: Error occurred :${inspect(error)}`);
      return null;
    }
  }

  static async flushCache() {
    if (!this.redisInstance || !this.isHealthy) {
      return;
    }
    try {
      logger.info(`RedisService.flushCache ${this.redisInstance.id} called :`);
      await this.redisInstance.flushall();
    } catch (error) {
      logger.error(`RedisService.set: Error occurred :${inspect(error)}`);
      // throw error;
    }
  }
}

export default RedisService;
