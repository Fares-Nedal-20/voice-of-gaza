import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import { getUserNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/getNotifications/:receiverId", verifyToken, getUserNotifications);

export default router;
