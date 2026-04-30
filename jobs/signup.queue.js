import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const signupQueue = new Queue("signupQueue", {
    connection: redisConnection,
});
