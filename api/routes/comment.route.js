import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/createComment/:postId", verifyToken, createComment);
router.get("/getComments", verifyToken, getComments);

export default router;
