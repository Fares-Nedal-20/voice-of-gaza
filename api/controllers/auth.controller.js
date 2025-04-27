import User from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  //   console.log(req.body);
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    return next(errorHandler(400, "All fields are required!"));
  }

  if (username) {
    if (username.length < 8) {
      return next(errorHandler(400, "Username must be 8 characters at least!"));
    }
  }
  if (password) {
    // if (password.length < 6) {
    //   return res
    //     .status(400)
    //     .json({ message: "Password must be 6 characters at least" });
    // }

    if (!validator.isStrongPassword(password, { minLength: 6 })) {
      return next(
        errorHandler(
          400,
          "Weak password (must contain lowercase, uppercase, numbers, symbols)!"
        )
      );
    }
  }

  //   validation of email manually using regex

  if (email) {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(email)) {
    //       return res.status(400).json({ message: "Invalid email format" });
    //     }
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Invalid email format!"));
    }
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(errorHandler(404, "Email or Username already exists!"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d", // After this time, the token becomes invalid.
    });
    await newUser.save(); // هان لما اعمل حفظ بيروح يتشيك على الرولز الخاصة بالموديل نفسه
    const { password: pass, ...rest } = newUser._doc;
    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // sets how long the cookie should exist in the browser.
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required!"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "Invalid email or password!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid email or password!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d", // After this time, the token becomes invalid.
    });
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // sets how long the cookie should exist in the browser.
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { username, email, profilePicture } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      const { password: pass, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          username.toLowerCase().split(" ").join("") +
          Math.random().toString(10).slice(-4),
        password: hashedPassword,
        email,
        profilePicture,
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      await newUser.save();
      const { password: pass, ...rest } = newUser._doc;
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .status(200)
      .clearCookie("access_token")
      .json("User is signed out successfuly");
  } catch (error) {
    next(error);
  }
};
