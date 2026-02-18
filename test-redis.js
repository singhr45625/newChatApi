import dotenv from "dotenv";
import Redis from "ioredis";
import path from "path";

dotenv.config({ path: path.resolve(".env") });

console.log("Testing Redis Connection...");
console.log("REDIS_URL from env:", process.env.REDIS_URL);

if (!process.env.REDIS_URL) {
    console.error("REDIS_URL not found in .env");
    process.exit(1);
}

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
    console.log("Successfully connected to Redis Cloud!");
    process.exit(0);
});

redis.on("error", (err) => {
    console.error("Redis Connection Error:", err.message);
    process.exit(1);
});

setTimeout(() => {
    console.error("Connection timed out");
    process.exit(1);
}, 5000);
