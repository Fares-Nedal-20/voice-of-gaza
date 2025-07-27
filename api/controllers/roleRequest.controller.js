import RoleRequest from "../models/roleRequest.model.js";
import { errorHandler } from "../utils/error.js";

export const createRequestRole = async (req, res, next) => {
  const { userId } = req.params;
  const { message } = req.body;
  if (userId !== req.user.id || req.user.role !== "reader") {
    return next(
      errorHandler(
        401,
        "You are not allowed to request role change unless you are a reader and it's your own account."
      )
    );
  }
  if (!message || message.trim().length === 0) {
    return next(errorHandler(400, "Message is required!"));
  }
  if (message.length > 200) {
    return next(
      errorHandler(400, "Message must be less than or equal 200 character!")
    );
  }
  try {
    const existingRequest = await RoleRequest.findOne({
      userId,
      status: "pending",
    });

    if (existingRequest) {
      return next(
        errorHandler(400, "You already have a pending role request!")
      );
    }

    const newRoleRequest = new RoleRequest({
      userId,
      message: message.trim(),
      status: "pending",
    });
    await newRoleRequest.save();

    res
      .status(201)
      .json({ message: "Your role request has been submitted successfully." });
  } catch (error) {
    next(error);
  }
};
