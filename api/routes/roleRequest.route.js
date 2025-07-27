import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import { createRequestRole } from "../controllers/roleRequest.controller.js";

const router = express.Router();

router.post("/request-role/:userId", verifyToken, createRequestRole);

export default router;
