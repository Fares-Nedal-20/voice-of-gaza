import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/getNotifications/:receiverId", verifyToken, getUserNotifications);
router.put("/markAsRead/:notificationId", verifyToken, markAsRead);
router.put("/markAllAsRead", verifyToken, markAllAsRead);

export default router;
