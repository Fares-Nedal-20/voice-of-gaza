import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  const { currentUser } = useSelector((state) => state.user);
  const [usersRes, setUsersRes] = useState({});
  const [postsRes, setPostsRes] = useState({});
  const [commentsRes, setCommentsRes] = useState({});
  console.log(usersRes, postsRes, commentsRes);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [users, posts, comments] = await Promise.all([
          fetch("/api/user/getUsers?limit=5").then((res) => res.json()),
          fetch("/api/post/getPosts?limit=5").then((res) => res.json()),
          fetch("/api/comment/getComments?limit=5").then((res) => res.json()),
        ]);

        setUsersRes(users);
        setPostsRes(posts);
        setCommentsRes(comments);
      } catch (error) {
        console.log("Error fetching dashboard data:", error);
      }
    };

    if (currentUser.role === "admin") {
      fetchAllData();
    }
  }, [currentUser._id]);

  return (
    <div className="mx:auto px-3 my-7">
      {/* Upper side */}
      <div className="w-full sm:mx-auto flex flex-col gap-4 sm:flex-row">
        {/* Users */}
        <div className="w-full bg-gray-50 p-3 rounded-lg shadow-md flex flex-col gap-3 hover:bg-gray-100 hover:shadow-lg transition-all">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="uppercase text-gray-700 font-medium text-lg">
                Total Users
              </span>
              <span className="text-xl font-medium text-gray-700">
                {usersRes.totalUsers}
              </span>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white text-5xl rounded-full p-3" />
          </div>
          <div className="flex items-center">
            <HiArrowNarrowUp className="text-teal-600" />
            <span className="text-teal-600">{usersRes.lastMonthUsers}</span>
            <span className="ml-2 text-gray-600">Last month</span>
          </div>
        </div>
        {/* Posts */}
        <div className="w-full bg-gray-50 p-3 rounded-lg shadow-md flex flex-col gap-3 hover:bg-gray-100 hover:shadow-lg transition-all">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="uppercase text-gray-700 font-medium text-lg">
                Total Posts
              </span>
              <span className="text-xl font-medium text-gray-700">
                {postsRes.totalPosts}
              </span>
            </div>
            <HiDocumentText className="bg-indigo-600 text-white text-5xl rounded-full p-3" />
          </div>
          <div className="flex items-center">
            <HiArrowNarrowUp className="text-teal-600" />
            <span className="text-teal-600">{postsRes.lastMonthPosts}</span>
            <span className="ml-2 text-gray-600">Last month</span>
          </div>
        </div>
        {/* Comments */}
        <div className="w-full bg-gray-50 p-3 rounded-lg shadow-md flex flex-col gap-3 hover:bg-gray-100 hover:shadow-lg transition-all">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="uppercase text-gray-700 font-medium text-lg">
                Total Comments
              </span>
              <span className="text-xl font-medium text-gray-700">
                {commentsRes.totalComments}
              </span>
            </div>
            <HiAnnotation className="bg-lime-600 text-white text-5xl rounded-full p-3" />
          </div>
          <div className="flex items-center">
            <HiArrowNarrowUp className="text-teal-600" />
            <span className="text-teal-600">
              {commentsRes.lastMonthComments}
            </span>
            <span className="ml-2 text-gray-600">Last month</span>
          </div>
        </div>
      </div>
      {/* Lower side */}
      <div className="mt-7 w-full sm:mx-auto flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          {/* Users table */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-3">
              <span className="text-gray-700 font-medium">Recent users</span>
              <Button className="cursor-pointer" color={"purple"} outline>
                <Link to={"/dashboard?tab=users"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <TableHead>
                <TableHeadCell>User Image</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y divide-gray-200">
                {usersRes.users?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <img
                        className="w-12 h-12 rounded-full"
                        src={user.profilePicture}
                        alt="user image"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Posts table */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between p-3">
              <span className="text-gray-700 font-medium">Recent posts</span>
              <Button className="cursor-pointer" color="yellow" outline>
                <Link to={"/dashboard?tab=posts"}>See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <TableHead>
                <TableHeadCell>Post Image</TableHeadCell>
                <TableHeadCell>Post Title</TableHeadCell>
                <TableHeadCell>Post Category</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y divide-gray-200">
                {postsRes.posts?.map((post) => (
                  <TableRow>
                    <TableCell>
                      <img
                        className="w-14 h-12 rounded-md object-cover bg-gray-500"
                        src={post.image}
                        alt="post image"
                      />
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {post.title}
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.category}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Comments table */}
        <div className="flex flex-col max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between p-3">
            <span className="text-gray-700 font-medium">Recent comments</span>
            <Button className="cursor-pointer" color="green" outline>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Comment Content</TableHeadCell>
              <TableHeadCell># Of Likes</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y divide-gray-200">
              {commentsRes.comments?.map((comment) => (
                <TableRow>
                  <TableCell className="font-medium truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell className="font-medium">
                    {comment.likeCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
