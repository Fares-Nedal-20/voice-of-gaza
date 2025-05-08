import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToBeDeleted, setUserIdToBeDeleted] = useState("");
  console.log(userIdToBeDeleted);

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

  const handleDeletePosts = async (userId) => {
    try {
      setShowModal(false);
      const res = await fetch(`/api/user/deleteUser/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (res.ok) {
        setUsers((prev) =>
          prev.filter((user) => user._id !== userIdToBeDeleted)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
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
                      <FaTimes
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToBeDeleted(user._id);
                        }}
                        className="text-red-500 text-lg cursor-pointer"
                      />
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
      {showModal && (
        <Modal
          show={showModal}
          popup
          size="md"
          onClose={() => setShowModal(false)}
        >
          <ModalHeader />
          <ModalBody className="flex flex-col items-center gap-6">
            <HiOutlineExclamationCircle className="w-16 h-16 text-gray-400" />
            <p className="font-medium text-gray-500">
              Are you sure you want to delete this user?
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                color="red"
                className="cursor-pointer"
                onClick={() => handleDeletePosts(userIdToBeDeleted)}
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
      )}
    </div>
  );
}
