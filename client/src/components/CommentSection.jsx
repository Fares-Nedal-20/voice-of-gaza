import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Textarea,
  Button,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection({ post }) {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [errorCommentSection, setErrorCommentSection] = useState(null);
  const [successCommentSubmit, setSuccessCommentSubmit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentIdToBeDeleted, setCommentIdToBeDeleted] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteCommentError, setDeleteCommentError] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [likeError, setLikeError] = useState(null);

  const fetchComments = async () => {
    try {
      setShowMore(true);
      const res = await fetch(`/api/comment/getComments?postId=${post?._id}`);
      const data = await res.json();
      setComments(data.comments);
      setTotalComments(data.totalComments);
      if (data.comments?.length < data.totalComments) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
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
        setFormData({ content: "" });
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

  const handleDelete = async () => {
    setShowModal(false);
    setErrorCommentSection(false);
    setSuccessCommentSubmit(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToBeDeleted}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setDeleteCommentError(data.message);
        return;
      }
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToBeDeleted)
        );
        fetchComments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startIndex}&postId=${post._id}`
      );
      const data = await res.json();
      if (!res.ok) {
        setShowMore(false);
        return;
      }
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (comments?.length + data.comments?.length === data.totalComments) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleLike = async (commentId) => {
    try {
      const res = await fetch(
        `/api/comment/likeComment/${currentUser._id}/${commentId}`
      );
      const data = await res.json();
      if (!res.ok) {
        setLikeError(data.message);
        return;
      }
      if (res.ok) {
        setComments(
          comments.map((comment) => {
            if (comment._id === commentId) {
              const alreadyLiked = comment.likes.includes(currentUser._id);
              let updatedLikes;
              if (alreadyLiked) {
                // Remove user from likes
                updatedLikes = comment.likes.filter(
                  (id) => id !== currentUser._id
                );
              } else {
                updatedLikes = [...comment.likes, currentUser._id];
              }

              return { ...comment, likes: updatedLikes };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <div className="flex flex-col gap-4 border-1 p-3 rounded-lg border-teal-500">
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
          {deleteCommentError && (
            <Alert color="failure">{deleteCommentError}</Alert>
          )}
          {likeError && <Alert color="failure">{likeError}</Alert>}

          <div className="flex gap-1 items-center text-gray-700">
            <span>Comments</span>
            <span className="px-1 border border-gray-700 rounded-xs">
              {totalComments}
            </span>
          </div>
          {comments?.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentIdToBeDeleted(commentId);
              }}
              onEdit={handleEdit}
              onLike={handleLike}
            />
          ))}
          {comments?.length > 0 && showMore && (
            <p
              onClick={handleShowMore}
              className="text-sm text-teal-500 hover:underline cursor-pointer ml-11"
            >
              Show more comments
            </p>
          )}
        </>
      ) : (
        <Link to={"/sign-in"} className="w-fit">
          <p className="text-teal-700 underline font-semibold">
            Sign in to show comments
          </p>
        </Link>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        popup
      >
        <ModalHeader />
        <ModalBody className="flex flex-col gap-6 items-center">
          <HiOutlineExclamationCircle className="w-16 h-16 text-gray-400" />
          <p className="font-medium text-gray-500">
            Are you sure you want to delete this comment?
          </p>
          <div className="flex justify-center items-center gap-4">
            <Button
              color={"red"}
              className="cursor-pointer"
              onClick={handleDelete}
            >
              Yes, I'm sure
            </Button>
            <Button
              color={"alternative"}
              className="cursor-pointer"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Yes, I'm sure
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
