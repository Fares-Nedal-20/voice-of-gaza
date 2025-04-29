import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://img.freepik.com/free-photo/technology-communication-icons-symbols-concept_53876-120314.jpg?ga=GA1.1.131351233.1739735698&semt=ais_hybrid&w=740",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
