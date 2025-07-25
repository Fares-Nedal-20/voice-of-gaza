import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import {
  createPost,
  updatePost,
  getPosts,
  deletePost,
  getTopViewedPost
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createPost", verifyToken, createPost);
router.get("/getPosts", getPosts);
router.put("/updatePost/:postId/:userId", verifyToken, updatePost);
router.delete("/deletePost/:postId", verifyToken, deletePost);
router.get("/topViewed", getTopViewedPost);

export default router;
