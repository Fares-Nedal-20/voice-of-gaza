import mongoose from "mongoose";

const roleRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentRole: {
      type: String,
      default: "reader",
    },
    requestedRole: {
      type: String,
      default: "writer",
    },
    message: {
      type: String,
      maxlength: 200,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const RoleRequest = mongoose.model("RoleRequest", roleRequestSchema);

export default RoleRequest;
