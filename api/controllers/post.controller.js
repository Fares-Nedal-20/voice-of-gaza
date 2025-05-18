import Joi from "joi";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

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
        .split(" ")
        .join("-")
        .replace(/[^a-z0-9-]+/g, "") + new Date().getTime(); // make a slug unique
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

export const updatePost = async (req, res, next) => {
  if (req.user.role !== "writer" || req.user.id !== req.params.userId) {
    return next(errorHandler(401, "You are not allowed to update this post!"));
  }
  if (req.body.title && req.body.title.length < 8) {
    console.log("first");
    return next(
      errorHandler(400, "Title of post must contain 8 characters at least!")
    );
  }
  if (req.body.content && req.body.content.length < 10) {
    return next(
      errorHandler(400, "Content of post must contain 10 characters at least!")
    );
  }
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(errorHandler(404, "Post not found!"));
    }

    if (req.body.title || req.body.content) {
      const newTitle = req.body.title || post.title;
      const newContent = req.body.content || post.content;
      // checks if any of the keywords appear in the combined string of title + content
      const isRelated = new RegExp(keywords.join("|"), "i").test(
        `${newTitle} ${newContent}`
      );

      if (!isRelated) {
        return next(
          errorHandler(
            400,
            "Post must be related to Voice of Gaza (e.g., Gaza, Palestine, etc.)."
          )
        );
      }
    }
    if (req.body.category) {
      const allowedCategory = Post.schema.path("category").enumValues;
      if (req.body.category && !allowedCategory.includes(req.body.category)) {
        return next(errorHandler(400, "Invalid category"));
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
          slug:
            req.body.title
              .toLowerCase()
              .split(" ")
              .join("-")
              .replace(/[^a-z0-9-]+/g, "") + new Date().getTime(),
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  const querySchema = Joi.object({
    startIndex: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(18).default(9),
    sort: Joi.string().valid("asc", "desc").default("desc"),
    postId: Joi.string().hex().length(24),
    authorId: Joi.string().hex().length(24),
    slug: Joi.string().min(1),
    category: Joi.string().min(1),
    searchTerm: Joi.string().min(1),
  }).unknown(true);
  try {
    const { value: validatedQuery, error } = querySchema.validate(req.query);
    if (error) {
      return next(errorHandler(400, error.details[0].message));
    }

    const {
      startIndex,
      limit,
      sort,
      postId,
      authorId,
      slug,
      category,
      searchTerm,
    } = validatedQuery;

    const sortDirection = sort === "asc" ? 1 : -1;

    // this code is work but its not clean and slow

    /* const posts = await Post.find({
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.authorId && { authorId: req.query.authorId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    }); */

    // this code is more readability, performance, and robustness

    const query = {};

    if (req.query.postId) query._id = postId;
    if (req.query.authorId) query.authorId = authorId;
    if (req.query.slug) query.slug = { $regex: slug, $options: "i" };
    if (req.query.category)
      query.category = { $regex: category, $options: "i" };
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Promise.all() waits until all three finish, so this way is faster than the previous way

    const [posts, totalPosts, lastMonthPosts] = await Promise.all([
      Post.find(query)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit),
      Post.countDocuments(query), // Count based on the same filters
      Post.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
    ]);

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You are not allowed to delete this post!"));
  }
  try {
    await Post.findOneAndDelete(req.params.postId);
    res.status(200).json("Post has been deleted!");
  } catch (error) {
    next(error);
  }
};
