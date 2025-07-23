import { errorHandler } from "../utils/error.js";
import Notification from "./../models/notification.model.js";

export const getUserNotifications = async (req, res, next) => {
  const { receiverId } = req.params;
  if (req.user.id !== receiverId) {
    return next(
      errorHandler(401, "You are not allowed to get this notifications!")
    );
  }
  try {
    const notifications = await Notification.find({receiver: receiverId}).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
