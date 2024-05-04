import { rateLimit } from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    limit: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: "You have exceeded 20 requests in 1 min limit",

    // store: ... , // Redis, Memcached, etc. See below.
});

export default rateLimiter;
