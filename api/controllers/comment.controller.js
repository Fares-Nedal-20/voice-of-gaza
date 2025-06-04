import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";
import Post from "./../models/post.model.js";

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
