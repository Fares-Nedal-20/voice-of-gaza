import User from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";

export const signup = async (req, res) => {
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
    return res.status(400).json({ message: "All field are required!" });
  }

  if (username) {
    if (username.length < 8) {
      return res
        .status(400)
        .json({ message: "Username must be 8 characters at least" });
    }
  }
  if (password) {
    // if (password.length < 6) {
    //   return res
    //     .status(400)
    //     .json({ message: "Password must be 6 characters at least" });
    // }

    if (!validator.isStrongPassword(password, { minLength: 6 })) {
      return res.status(400).json({
        message:
          "Weak password(must contain lowercase, uppercase, numbers, symbols)",
      });
    }
  }

  //   validation of email manually using regex

  if (email) {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(email)) {
    //       return res.status(400).json({ message: "Invalid email format" });
    //     }
    if (!validator.isEmail(email)) {
      return res.status.json({ message: "Invalid email format!" });
    }
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Username already exists!" });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    await newUser.save(); // هان لما اعمل حفظ بيروح يتشيك على الرولز الخاصة بالموديل نفسه
    const { password: pass, ...rest } = newUser._doc;
    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    res.status(500).json(error);
  }
};
