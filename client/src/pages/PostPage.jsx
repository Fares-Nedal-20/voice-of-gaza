import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import TrendingPostByComments from "../components/TrendingPostByComments";
import TrendingPostByViews from "../components/TrendingPostByViews";
import { Carousel } from "flowbite-react";

export default function PostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState({});
  const [authorOfPost, setAuthorOfPost] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
      const data = await res.json();
      if (!res.ok) return;
      if (res.ok) {
        setPost(data.posts[0]);
      }
      const authorOfPostRes = await fetch(
        `/api/user/getUsers?userId=${data.posts[0].authorId}`
      );
      const authorOfPostData = await authorOfPostRes.json();
      if (!authorOfPostRes.ok) return;
      if (authorOfPostRes.ok) {
        setAuthorOfPost(authorOfPostData.users[0].username);
      }
    };
    fetchPost();
  }, [postSlug]);

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1
        className="text-4xl font-serif text-slate-700 text-center mb-2"
        style={{ textShadow: "0 2px 2px rgba(0, 0, 0, 0.3)" }}
      >
        <span className="text-slate-900">Title: </span>
        {post.title}
      </h1>
      <img
        src={post.image}
        alt="Post cover"
        className="h-[500px] w-full object-cover rounded-lg"
      />
      <span className="text-sm text-slate-700 text-center">
        Last update in{" "}
        <span className="underline italic font-medium">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>{" "}
        by <span className="underline italic font-medium">{authorOfPost}</span>
      </span>
      <div
        className="post-content w-full max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      
      <div className="max-w-4xl w-full mx-auto mb-7 carousel-wrapper">
        <Carousel indicators={false}>
          <TrendingPostByComments />
          <TrendingPostByViews />
        </Carousel>
      </div>
      <CommentSection post={post} />
    </div>
  );
}
