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
    const notifications = await Notification.find({
      receiver: receiverId,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      return next(errorHandler(404, "Notification not found!"));
    }
    if (notification.receiver.toString() !== req.user.id) {
      return next(
        errorHandler(
          401,
          "You are not allowed to mark this notification as read!"
        )
      );
    }
    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};
