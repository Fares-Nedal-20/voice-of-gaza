import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToBeDeleted, setUserIdToBeDeleted] = useState("");
  const [searchData, setSearchData] = useState({ role: "all" });
  const [showUsersError, setShowUsersError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const usernameFromUrl = urlParams.get("username");
    const emailFromUrl = urlParams.get("email");
    const roleFromUrl = urlParams.get("role");
    if (usernameFromUrl || emailFromUrl || roleFromUrl) {
      setSearchData({
        ...searchData,
        username: usernameFromUrl,
        email: emailFromUrl,
        role: roleFromUrl,
      });
    }

    const fetchUsers = async () => {
      setShowUsersError(null);
      setShowMore(true);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/user/getUsers?${searchQuery}`);
        const data = await res.json();
        if (!res.ok) {
          return setShowUsersError(data.message);
        }
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setShowUsersError(error.message);
      }
    };

    if (currentUser.role === "admin") {
      fetchUsers();
    }
  }, [currentUser._id, location.search]);

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams(location.search);
    const usernameFromUrl = urlParams.get("username");
    const emailFromUrl = urlParams.get("email");
    const roleFromUrl = urlParams.get("role");
    const searchQuery = urlParams.toString();
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/user/getUsers?startIndex=${startIndex}&${searchQuery}`
      );
      const data = await res.json();
      if (!res.ok) {
        setShowMore(false);
        return;
      }
      if (res.ok) {
        setUsers([...users, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        } else {
          setShowMore(true);
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

  const handleChange = (e) => {
    if (e.target.id === "username") {
      setSearchData({ ...searchData, username: e.target.value });
    }
    if (e.target.id === "email") {
      setSearchData({ ...searchData, email: e.target.value });
    }
    if (e.target.id === "role") {
      setSearchData({ ...searchData, role: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (Object.keys(searchData).length === 0) return;
      const urlParams = new URLSearchParams(location.search);

      urlParams.delete("username");
      urlParams.delete("email");
      urlParams.delete("role");

      if (searchData.username && searchData.username.trim() !== "") {
        urlParams.set("username", searchData.username);
      }
      if (searchData.email && searchData.email.trim() !== "") {
        urlParams.set("email", searchData.email);
      }
      if (searchData.role && searchData.role.trim() !== "") {
        urlParams.set("role", searchData.role);
      }

      const searchQuery = urlParams.toString();
      navigate(`/dashboard?${searchQuery}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-3 py-4">
      {/* Search section */}
      <form className="mb-6 max-w-5xl" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-3 gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-1 flex-1">
            <Label className="ml-1 text-gray-800">Username</Label>
            <TextInput
              value={searchData.username || ""}
              onChange={handleChange}
              placeholder="Username"
              id="username"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Label className="ml-1 text-gray-800">Email</Label>
            <TextInput
              value={searchData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              id="email"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Label className="ml-1 text-gray-800">Role</Label>
            <Select
              onChange={handleChange}
              id="role"
              value={searchData.role || "all"}
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="writer">Writer</option>
              <option value="reader">Reader</option>
            </Select>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Button size="lg" type="submit" className="cursor-pointer">
            Search
          </Button>
          {showUsersError && (
            <Alert color="failure" className="flex-1">
              {showUsersError}
            </Alert>
          )}
        </div>
      </form>
      {/* Table Section */}
      <div className="table-auto md:mx-auto overflow-x-auto scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
        {currentUser?.role === "admin" ? (
          <>
            <Table hoverable className="shadow-md bg-white">
              <TableHead>
                <TableRow>
                  <TableHeadCell>#</TableHeadCell>
                  <TableHeadCell>Created At</TableHeadCell>
                  <TableHeadCell>Profile Picture</TableHeadCell>
                  <TableHeadCell>Username</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Following</TableHeadCell>
                  <TableHeadCell>Followers</TableHeadCell>
                  <TableHeadCell>Role</TableHeadCell>
                  <TableHeadCell>Delete</TableHeadCell>
                </TableRow>
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
                      <TableCell className="text-center text-green-500">
                        {user.following?.length || 0}
                      </TableCell>
                      <TableCell className="text-center text-yellow-500">
                        {user.followers?.length || 0}
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
                        {user.role !== "admin" && (
                          <FaTimes
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToBeDeleted(user._id);
                            }}
                            className="text-red-500 text-lg cursor-pointer"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {users.length > 0 && showMore && (
              <button
                onClick={handleShowMore}
                className="text-teal-500 cursor-pointer my-7 text-center w-full hover:underline"
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
    </div>
  );
}
