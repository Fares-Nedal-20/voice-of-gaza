import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import validator from "validator";
import bcryptjs from "bcryptjs";
import Joi from "joi";

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

export const deleteUser = async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to delete this user!"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    if (req.user.id === req.params.userId) {
      res
        .status(200)
        .clearCookie("access_token")
        .json("User has been deleted!");
    } else {
      res.status(200).json("User has been deleted!");
    }
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  const querySchema = Joi.object({
    startIndex: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(18).default(9),
    sort: Joi.string().valid("asc", "desc").default("desc"),
    userId: Joi.string().hex().length(24),
    username: Joi.string().alphanum().min(1).max(50),
    email: Joi.string().email(),
    role: Joi.string().valid("admin", "writer", "reader", "all"),
    tab: Joi.string(),
  });

  try {
    const { value: validatedQuery, error } = querySchema.validate(req.query);

    // console.log(validatedQuery);
    if (error) {
      return next(errorHandler(400, error.details[0].message));
    }

    const { startIndex, limit, sort, username, email, role, userId } =
      validatedQuery;

    const sortDirection = sort === "asc" ? 1 : -1;

    const queryToSearch = {};

    if (userId) queryToSearch._id = userId;
    if (username) queryToSearch.username = { $regex: username, $options: "i" };
    if (email) queryToSearch.email = { $regex: email, $options: "i" };
    if (role && role !== "all") {
      queryToSearch.role = role;
    }

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const [users, totalUsers, lastMonthUsers] = await Promise.all([
      User.find(queryToSearch)
        .select("-password")
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .lean(),
      User.countDocuments(queryToSearch),
      User.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
    ]);

    res.status(200).json({
      users,
      totalUsers,
      lastMonthUsers,
    });

    /*
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const queryToSearch = {};
    if (req.query.userId) queryToSearch._id = req.query.userId;
    if (req.query.username) {
      queryToSearch.username = { $regex: req.query.username, $options: "i" };
    }
    if (req.query.email) {
      queryToSearch.email = { $regex: req.query.email, $options: "i" };
    }
    if (req.query.role) queryToSearch.role = req.query.role;

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const [users, totalUsers, lastMonthUsers] = await Promise.all([
      User.find(queryToSearch)
        .select("-password")
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .lean(),
      User.countDocuments(queryToSearch),
      User.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
    ]);

    // const usersWithoutPassword = users.map((user) => {
    //   const { password: pass, ...rest } = user._doc;
    //   return rest;
    // });

    res.status(200).json({ users, totalUsers, lastMonthUsers });
    */
  } catch (error) {
    next(error);
  }
};
