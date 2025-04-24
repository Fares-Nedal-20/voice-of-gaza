import express from "express";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use("/api/user", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
