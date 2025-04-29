import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  if (req.user.role !== "writer") {
    return next(errorHandler(401, "You are not allowed to create post!"));
  }
  if (req.body.title && req.body.title.length < 8) {
    return next(
      errorHandler(400, "Title of post must contain 8 characters at least!")
    );
  }
  if (req.body.content && req.body.content.length < 10) {
    return next(
      errorHandler(400, "Content of post must contain 10 characters at least!")
    );
  }

  const keywords = [
    "gaza",
    "palestine",
    "palestinian",
    "occupation",
    "siege",
    "resistance",
    "nakba",
    "intifada",
    "idf",
    "israeli",
    "settler",
    "apartheid",
    "freedom",
    "blockade",
    "war",
    "airstrike",
    "humanitarian",
    "rafah",
    "west bank",
    "jerusalem",
    "al-aqsa",
    "hamas",
    "fateh",
    "ceasefire",
    "massacre",
    "genocide",
    "solidarity",
    "displacement",
    "bombardment",
    "freedom fighters",
    "zionism",
    "injustice",
    "martyr",
    "refugee",
    "aid",
    "shelling",
    "death toll",
    "freedom of speech",
  ];

  try {
    // const isRelated = /gaza|palestine|occupation|siege|resistance/i.test(`${title} ${content}`);
    const isRelated = new RegExp(keywords.join("|"), "i").test(
      `${req.body.title} ${req.body.content}`
    );
    if (!isRelated) {
      return next(
        errorHandler(
          400,
          "Post must be related to Voice of Gaza (e.g., Gaza, Palestine, etc.)."
        )
      );
    }

    const slug =
      req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .split(" ")
        .join("-") + new Date().getTime(); // make a slug unique
    const newPost = new Post({
      ...req.body,
      authorId: req.user.id,
      slug,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};
