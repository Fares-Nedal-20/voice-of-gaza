import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import TrendingPostByComments from "../components/TrendingPostByComments";
import TrendingPostByViews from "../components/TrendingPostByViews";
import { Alert, Button, Carousel } from "flowbite-react";
import { useSelector } from "react-redux";
import { SlUserFollowing, SlUserUnfollow } from "react-icons/sl";

export default function PostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { postSlug } = useParams();
  const [post, setPost] = useState({});
  const [authorOfPost, setAuthorOfPost] = useState("");
  const [followError, setFollowError] = useState(null);
  const [followSuccess, setFollowSuccess] = useState(null);
  const [followToggle, setFollowToggle] = useState(true);

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
        setAuthorOfPost(authorOfPostData.users[0]);
      }
    };
    fetchPost();
  }, [postSlug]);

  const handleFollow = async () => {
    try {
      setFollowError(null);
      setFollowSuccess(null);
      const res = await fetch(`/api/user/follow/${authorOfPost._id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) {
        setFollowError(data.message);
        return;
      }
      setFollowToggle((prev) => !prev)
      setFollowSuccess(data.message);
    } catch (error) {
      console.log(error);
    }
  };

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
        by{" "}
        <span className="underline italic font-medium">
          {authorOfPost.username}
        </span>
      </span>
      <span className="w-fit mx-auto">
        {currentUser._id !== authorOfPost._id &&
        !authorOfPost.followers?.includes(currentUser._id) && followToggle ? (
          <Button
            onClick={handleFollow}
            className="flex items-center gap-2 ml-2 cursor-pointer"
            size="sm"
            outline
            color={"green"}
          >
            Follow
            <SlUserFollowing />
          </Button>
        ) : currentUser._id !== authorOfPost._id ? (
          <Button
            onClick={handleFollow}
            className="ml-2 cursor-pointer flex items-center gap-2"
            size="sm"
            outline
            color={"red"}
          >
            Unfollow
            <SlUserUnfollow />
          </Button>
        ) : null}
      </span>
      {followError && (
        <Alert className="w-full max-w-4xl mx-auto" color="failure">
          {followError}
        </Alert>
      )}
      {followSuccess && (
        <Alert className="w-full max-w-4xl mx-auto" color="success">
          {followSuccess}
        </Alert>
      )}
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
