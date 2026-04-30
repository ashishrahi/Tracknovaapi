import Redis from "ioredis";

/**
 * Shared Redis client for BullMQ. `maxRetriesPerRequest: null` is required for BullMQ workers.
 *
 * @see https://docs.bullmq.io/guide/connections
 */
export const redisConnection = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
