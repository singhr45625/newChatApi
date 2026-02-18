import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { message: message || "Too many requests, please try again later." },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

export const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    20, // Limit each IP to 20 requests per `window`
    "Too many login attempts from this IP, please try again after 15 minutes"
);

export const messageLimiter = createRateLimiter(
    1 * 60 * 1000, // 1 minute
    60, // Limit each IP to 60 requests per minute
    "Too many messages sent, please slow down"
);
