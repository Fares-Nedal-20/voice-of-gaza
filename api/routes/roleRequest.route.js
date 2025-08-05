import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import {
  createRequestRole,
  getRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
} from "../controllers/roleRequest.controller.js";

const router = express.Router();

router.post("/request-role/:userId", verifyToken, createRequestRole);
router.get("/role-requests", verifyToken, getRoleRequests);
router.patch(
  "/role-request-approve/:roleRequestId",
  verifyToken,
  approveRoleRequest
);
router.patch(
  "/role-request-reject/:roleRequestId",
  verifyToken,
  rejectRoleRequest
);

export default router;
