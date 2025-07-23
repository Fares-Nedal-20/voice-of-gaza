import express from "express";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("DB is connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notification", notificationRoutes);

app.use((err, req, res, next) => {
  if (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
