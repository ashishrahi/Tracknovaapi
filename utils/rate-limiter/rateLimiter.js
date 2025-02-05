import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs:  1 * 60 * 1000  ,// 15 * 60 * 1000, // 15 minutes
	limit: 25, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    // message: { error: 'Too many requests, please try again later.' },
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

    handler: (req, res, next, options) => {
        // Extracts `Retry-After` header from `RateLimit-Reset`
        const retryAfterMs = Math.max((req.rateLimit.resetTime - Date.now()), 0); // Ensure it's never negative
        const retryAfterSeconds = Math.ceil(retryAfterMs / 1000); // Convert to seconds

        res.status(options.statusCode).json({
            error: "Too many requests",
            message: `You have exceeded the limit. Try again after ${retryAfterSeconds} seconds.`,
            // retryAfter: retryAfterSeconds, // Send actual remaining wait time
            maxRequests: options.limit,
        });
    },
})

export default limiter;