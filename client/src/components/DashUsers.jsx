import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  console.log(showMore);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getUsers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.role === "admin") {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`);
      const data = await res.json();
      if (!res.ok) {
        return setShowMore(false);
      }
      if (res.ok) {
        setUsers([...users, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {}
  };

  return (
    <div className="table-auto md:mx-auto px-3 py-4 overflow-x-auto scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
      {currentUser?.role === "admin" ? (
        <>
          <Table hoverable className="shadow-md bg-white">
            <TableHead>
              <TableHeadCell>#</TableHeadCell>
              <TableHeadCell>Created At</TableHeadCell>
              <TableHeadCell>Profile Picture</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Role</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            <TableBody>
              {users &&
                users.length > 0 &&
                users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    className="divide-y-1 divide-gray-200"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 object-cover rounded-full bg-gray-200"
                      />
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {user.username}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {user.email}
                    </TableCell>
                    <TableCell
                      className={`font-medium ${
                        user.role === "admin" && "text-green-500"
                      } ${user.role === "writer" && "text-yellow-500"} ${
                        user.role === "reader" && "text-orange-400"
                      }`}
                    >
                      {user.role}
                    </TableCell>
                    <TableCell>
                      <FaTimes className="text-red-500 text-lg cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {users.length > 0 && showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 cursor-pointer my-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="text-center my-7 font-semibold text-xl">
          There is no users here!
        </p>
      )}
    </div>
  );
}
