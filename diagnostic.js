import express from "express";
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
console.log("authRoutes imported");
import messageRoutes from "./routes/message.route.js";
console.log("messageRoutes imported");
import { connectDB } from "./lib/db.js";
console.log("connectDB imported");

console.log("All imports successful");
process.exit(0);
