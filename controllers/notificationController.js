import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({user: req.user.id}).sort({
    createdAt: -1,
  });

  res.json(notifications);
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    {read: true},
    {new: true},
  );
  res.json(notification);
};

export const createNotification = async (req, res) => {
  const notification = await Notification.create({
    message: req.body.message,
  });

  const io = req.app.get("io");

  io.emit("newNotification", notification);

  res.json(notification);
};
