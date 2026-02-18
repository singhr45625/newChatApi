import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage, createGroup, getGroups, getGroupMessages, sendGroupMessage } from "../controllers/message.controller.js";
import { getUsersForSidebar, searchUsers } from "../controllers/user.controller.js";
import { messageLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/search", protectRoute, searchUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, messageLimiter, sendMessage);

router.post("/groups", protectRoute, createGroup);
router.get("/groups/all", protectRoute, getGroups);
router.get("/groups/:id", protectRoute, getGroupMessages);
router.post("/groups/send/:id", protectRoute, messageLimiter, sendGroupMessage);

export default router;
