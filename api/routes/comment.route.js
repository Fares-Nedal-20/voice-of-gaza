import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getComments,
  deleteComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/createComment/:postId", verifyToken, createComment);
router.get("/getComments", verifyToken, getComments);
router.delete("/deleteComment/:commentId", verifyToken, deleteComments);

export default router;
