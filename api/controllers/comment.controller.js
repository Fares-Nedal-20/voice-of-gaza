import Joi from "joi";
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";
import Post from "./../models/post.model.js";
import mongoose from "mongoose";

const bannedWords = [
  "kill",
  "rape",
  "bomb",
  "terrorist",
  "slut",
  "whore",
  "bastard",
  "fuck",
  "shit",
  "dumb",
  "idiot",
  "moron",
  "nazi",
  "zionist pig",
  "go to hell",
  "burn in hell",
  "كلب",
  "حمار",
  "حقير",
  "تافه",
  "زاني",
  "قذر",
  "كافر",
  "زنجي",
  "إرهابي",
  "لعنة",
  "اللعنة",
  "لعنة الله عليك",
  "انقلع",
  "قحبة",
  "خنزير",
  "صهيوني",
  "تف عليك",
];

export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return next(errorHandler(400, "Content is required!"));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found!"));
    }

    const hasBadWords = bannedWords.some((word) =>
      content.toLowerCase().includes(word)
    );

    if (hasBadWords) {
      return next(errorHandler(400, "Inappropriate language is not allowed!"));
    }

    const newComment = new Comment({
      postId,
      userId: req.user.id,
      content,
    });

    await newComment.save();

    await newComment.populate("userId", "username email profilePicture");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    ).select("commentsCount");

    console.log(updatedPost);

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
      commentsCount: updatedPost.commentsCount, // number of comments in a spesific post
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "writer") {
    return next(errorHandler(401, "You are not allowed to show comments!"));
  }
  const querySchema = Joi.object({
    startIndex: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(18).default(3),
    sort: Joi.string().valid("asc", "desc").default("desc"),

    commentId: Joi.string().hex().length(24),
    postId: Joi.string().hex().length(24),
    userId: Joi.string().hex().length(24),
    content: Joi.string().min(1).max(50),
  });

  try {
    const { value: validatedQuery, error } = querySchema.validate(req.query);
    console.log(validatedQuery);
    if (error) {
      return next(errorHandler(400, error.details[0].message));
    }

    const { startIndex, limit, sort, commentId, postId, userId, content } =
      validatedQuery;

    const sortDirection = sort === "asc" ? 1 : -1;

    const query = {};

    if (commentId) query._id = commentId;
    if (postId) query.postId = postId;
    if (userId) query.userId = userId;
    if (content) query.content = { $regex: content, $options: "i" };

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const [comments, totalComments, lastComments] = await Promise.all([
      Comment.find(query)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .populate("userId", "username email profilePicture"),
      Comment.countDocuments(query),
      Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
    ]);

    res.status(200).json({
      comments,
      totalComments,
      lastComments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComments = async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "writer") {
    return next(
      errorHandler(401, "You are not allowed to delete this comment!")
    );
  }
  try {
    const { commentId } = req.params;
    const commentExist = await Comment.findById(commentId);
    if (!commentExist) {
      return next(errorHandler(404, "Comment not found!"));
    }
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json("Comment is deleted successfuly!");
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(401, "You are not allowed to update this comment!")
    );
  }
  try {
    const commentExist = await Comment.findById(req.params.commentId);
    if (!commentExist) {
      return next(errorHandler(404, "Comment not found!"));
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
        isEdited: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Comment is updated successfuly",
      updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  const { commentId, userId } = req.params;

  if (req.user.id !== userId) {
    return next(errorHandler(401, "You are not allowed to like this comment!"));
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return next(errorHandler(400, "CommentId is not valid!"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found!"));
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      message: hasLiked ? "Comment unliked" : "Comment liked",
      likeCount: comment.likes.length,
      likedByUser: !hasLiked,
    });
  } catch (error) {
    next(error);
  }
};
