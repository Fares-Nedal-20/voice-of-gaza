import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import validator from "validator";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: "Api route is working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to update this user!"));
  }
  if (
    (!req.body.username &&
      !req.body.email &&
      !req.body.password &&
      !req.body.profilePicture) ||
    req.body.username === "" ||
    req.body.email === "" ||
    req.body.password === ""
  ) {
    return next(errorHandler(400, "There is no field that updated!"));
  }
  if (req.body.username) {
    if (req.body.username.length < 8) {
      return next(errorHandler(400, "Username must be 8 characters at least!"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowecase!"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(
          400,
          "Username can only contain letters and numbers without spaces!"
        )
      );
    }
    // if (req.body.username.includes(" ")) {
    //   return next(errorHandler(400, "Username should not contain spaces!"));
    // }
  }
  if (req.body.email) {
    if (!validator.isEmail(req.body.email)) {
      return next(errorHandler(400, "Invalid email format!"));
    }
  }
  if (req.body.password) {
    if (!validator.isStrongPassword(req.body.password, { minLength: 6 })) {
      return next(
        errorHandler(
          400,
          "Weak password (must contain lowercase, uppercase, numbers, symbols)!"
        )
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
