import {
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [authors, setAuthors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [postIdToBeDeleted, setPostIdToBeDeleted] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();
        if (!res.ok) {
          return;
        }
        if (res.ok) {
          setPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [currentUser._id]);

  useEffect(() => {
    const uniqueAuthorIds = [...new Set(posts.map((post) => post.authorId))];

    uniqueAuthorIds.forEach((authorId) => {
      if (!authors[authorId]) {
        getAuthorById(authorId);
      }
    });
  }, [posts]);

  const getAuthorById = async (authorId) => {
    const res = await fetch(`/api/user/getUsers?userId=${authorId}`);
    const data = await res.json();
    if (!res.ok) {
      return;
    }
    if (res.ok && data.users.length > 0) {
      setAuthors({ ...authors, [authorId]: data.users[0] });
    }
  };

  const handleShowMore = async () => {
    try {
      const startIndex = posts.length;
      const res = await fetch(`/api/post/getPosts?startIndex=${startIndex}`);
      const data = await res.json();
      if (!res.ok) {
        setShowMore(false);
        return;
      }
      if (res.ok) {
        setPosts([...posts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePosts = async (postId) => {
    try {
      setShowModal(false);
      const res = await fetch(`/api/post/deletePost/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (res.ok) {
        setPosts((prev) =>
          prev.filter((post) => post._id !== postIdToBeDeleted)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-3 py-4 table-auto md:mx-auto overflow-x-auto scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
      <Table hoverable className="shadow-md bg-white">
        <TableHead>
          <TableHeadCell>#</TableHeadCell>
          <TableHeadCell>Updated At</TableHeadCell>
          <TableHeadCell>Post Image</TableHeadCell>
          <TableHeadCell>Author</TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Category</TableHeadCell>
          <TableHeadCell>Edit/Delete</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y-1 divide-gray-200">
          {posts &&
            currentUser.role === "admin" &&
            posts.map((post, index) => (
              <TableRow key={post._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {post.image && (
                    <img
                      className="w-14 h-10 object-cover rounded-sm bg-gray-300"
                      src={post.image}
                      alt={post.title}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {authors[post.authorId]?.username || "Loading..."}
                </TableCell>
                <TableCell className="truncate">
                  {post.title.length > 35
                    ? `${post.title.slice(0, 35)}...`
                    : post.title}
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-center">
                    <span className="block text-green-500 cursor-pointer hover:underline">
                      Edit
                    </span>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToBeDeleted(post._id);
                      }}
                      className="block text-red-500 cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {posts.length > 0 && showMore && (
        <button
          onClick={handleShowMore}
          className="my-7 cursor-pointer hover:underline text-teal-500 text-center w-full"
        >
          Show More
        </button>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody className="flex flex-col items-center gap-6">
          <HiOutlineExclamationCircle className="w-16 h-16 text-gray-400" />
          <p className="font-medium text-gray-500">
            Are you sure you want to delete this post?
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              color="red"
              className="cursor-pointer"
              onClick={() => handleDeletePosts(postIdToBeDeleted)}
            >
              Yes, I'm sure
            </Button>
            <Button
              color="alternative"
              className="cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              No, Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
