import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [authors, setAuthors] = useState({});
  console.log(authors);

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
                      className="w-10 h-10 object-cover rounded-full bg-gray-300"
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
                    <span className="block text-red-500 cursor-pointer hover:underline">
                      Delete
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {posts && showMore && (
        <button
          onClick={handleShowMore}
          className="my-7 cursor-pointer hover:underline text-teal-500 text-center w-full"
        >
          Show More
        </button>
      )}
    </div>
  );
}
