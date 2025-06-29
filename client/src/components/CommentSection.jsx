import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Textarea, Button, Alert, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useEffect } from "react";

export default function CommentSection({ post }) {
  console.log(post);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [errorCommentSection, setErrorCommentSection] = useState(null);
  const [successCommentSubmit, setSuccessCommentSubmit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);

  console.log(comments, totalComments);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/getComments?postId=${post?._id}`);
      const data = await res.json();
      setComments(data.comments);
      setTotalComments(data.totalComments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickSubmitComment = async () => {
    try {
      setErrorCommentSection(null);
      setSuccessCommentSubmit(null);
      setLoading(true);
      const res = await fetch(`/api/comment/createComment/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data.comment);
      console.log(data);
      if (!res.ok) {
        setErrorCommentSection(data.message);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setLoading(false);
        setSuccessCommentSubmit("Comment created successfully!");
        fetchComments();
      }
    } catch (error) {
      setErrorCommentSection(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 mt-[-50px]">
      {currentUser ? (
        <>
          <div className="text-sm flex gap-1 items-center font-medium">
            <span className="text-gray-700">Signed in as: </span>
            <img
              className="w-6 h-6 rounded-full"
              src={currentUser?.profilePicture}
              alt="user avatar"
            />
            <Link to={"/dashboard?tab=profile"}>
              <span className="text-teal-500 text-xs hover:underline cursor-pointer">
                @{currentUser?.username}
              </span>
            </Link>
          </div>
          <div className="flex flex-col gap-4 border border-1 p-3 rounded-lg border-teal-500">
            <Textarea
              placeholder="Add a comment..."
              className="text-sm"
              rows={3}
              maxLength={1000}
              id="content"
              onChange={(e) => setFormData({ content: e.target.value })}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs">
                {1000 - (formData.content?.length || 0)} characters remaining
              </span>
              <Button
                size="sm"
                disabled={loading}
                onClick={handleClickSubmitComment}
              >
                {loading ? (
                  <div className="flex gap-1 items-center">
                    <Spinner size="sm" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
          {errorCommentSection && (
            <Alert color="failure">{errorCommentSection}</Alert>
          )}
          {successCommentSubmit && (
            <Alert color="success">{successCommentSubmit}</Alert>
          )}
          <div className="flex gap-1 items-center text-gray-700">
            <span>Comments</span>
            <span className="px-1 border border-gray-700 rounded-xs">
              {totalComments}
            </span>
          </div>
          <Comment comments={comments} />
        </>
      ) : (
        <Link to={"/sign-in"} className="w-fit">
          <p className="text-teal-700 underline font-semibold">
            Sign in to show comments
          </p>
        </Link>
      )}
    </div>
  );
}
