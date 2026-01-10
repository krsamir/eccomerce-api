import { Queue } from "bullmq";
import { logger as logs, QUEUE_HANDLERS } from "@ecom/utils";
import { RedisService } from "@ecom/datasource";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class BullQueue {
  queue = null;
  redisInstance = null;

  constructor(queueName = "default") {
    // if (!this.redisInstance) {
    //   this.redisInstance = new Redis({
    //     ...redisConfig,
    //     retryStrategy(times) {
    //       console.log("🚀 ~ RedisService ~ getInstance ~ times:", times);
    //       if (times >= 2) {
    //         return null;
    //       }
    //       return Math.min(times * 200, 2000);
    //     },
    //   });
    //   this.redisInstance.on("connect", () => {
    //     console.log("Redis connected");
    //   });
    //   this.redisInstance.on("ready", () => {
    //     console.log("Redis ready");
    //   });
    //   this.redisInstance.on("error", (err) => {
    //     console.error("Redis connection error:", err);
    //   });
    //   this.redisInstance.on("close", () => {
    //     console.warn("Redis connection closed");
    //   });
    //   this.redisInstance.on("reconnecting", (delay) => {
    //     console.warn(`Redis reconnecting in ${delay}ms`);
    //   });
    if (!this.queue) {
      this.queue = new Queue(queueName, {
        connection: RedisService.getInstance(),
      });
    }
    // }
  }

  addToQueue({ eventName = "", data = null }) {
    console.log("🚀 ~ BullQueue ~ addToQueue ~ eventName:", eventName);
    logger.info(`${eventName} added to Queue.`);
    if (this.queue) {
      return this.queue.add(eventName, data);
    }
    logger.error("Queue is unavailble");
    return;
  }
}

export default new BullQueue(QUEUE_HANDLERS.PUBLISH_PRODUCTS);
