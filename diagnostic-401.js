import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cookieParser());

const origins = [
    "http://localhost:5173",
    "https://newchatapi.onrender.com",
    "https://b63fwxhc-5173.inc1.devtunnels.ms",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: origins, credentials: true }));

app.get("/diag", (req, res) => {
    res.json({
        node_env: process.env.NODE_ENV,
        port: process.env.PORT,
        frontend_url: process.env.FRONTEND_URL,
        allowed_origins: origins,
        cookies_received: req.cookies,
        headers: req.headers,
    });
});

const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Diagnostic server running on port ${PORT}`);
    console.log("Allowed Origins:", origins);
});
