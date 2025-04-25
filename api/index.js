import express from "express";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(express.json());

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

app.use((err, req, res, next) => {
  if (err) {
    const statusCode = err.statusCode;
    const message = err.message;
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
