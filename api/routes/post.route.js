import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import { createPost, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createPost", verifyToken, createPost);
router.put("/updatePost/:postId/:userId", verifyToken, updatePost);

export default router;
