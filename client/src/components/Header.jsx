import {
  Button,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
  Modal,
  ModalHeader,
  ModalBody,
  Select,
  Textarea,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { themeToggle } from "../redux/theme/themeSlice";
import { CgProfile } from "react-icons/cg";
import { HiLogout } from "react-icons/hi";
import { signout } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { MdOutlineNotificationsActive } from "react-icons/md";
import moment from "moment";

export default function Header() {
  const path = useLocation().pathname;
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  console.log(location.pathname, location.search);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (res.ok) {
        dispatch(signout());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `/api/notification/getNotifications/${currentUser._id}`
        );
        const data = await res.json();
        if (!res.ok) {
          return;
        }
        setNotifications(data);
        setUnreadCount(
          data.filter((notification) => !notification.isRead).length
        );
      } catch (error) {
        console.log("Failed to load notifications", error);
      }
    };

    fetchNotifications();
  }, [currentUser, location.pathname]);

  console.log(notifications, unreadCount);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await fetch(
        `/api/notification/markAsRead/${notificationId}`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      setUnreadCount((prev) => prev - 1);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      // for (const notification of notifications) {
      //   if (notification._id === notificationId) {
      //     setNotifications([...notifications, (notification.isRead = true)]);
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`/api/notification/markAllAsRead`, {
        method: "PUT",
      });
      if (!res.ok) {
        return;
      }
      setUnreadCount(0);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      // for (const notification of notifications) {
      //   setNotifications([...notifications, (notification.isRead = true)]);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar className="border-b border-gray-300 shadow-md">
      <Link to={"/"}>
        <img
          src="/logo-_1_.svg"
          alt="logo"
          className=" h-10 w-14 rounded-full object-contain"
        />
      </Link>
      <form
        onSubmit={handleSubmitSearch}
        className="hidden md:inline outline-none"
      >
        <TextInput
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          defaultValue={path === "/search" ? searchTerm : ""}
        />
      </form>
      <Link to={"/search"}>
        <Button pill color="light" className="inline md:hidden">
          <AiOutlineSearch />
        </Button>
      </Link>
      {/* for any tag, his order is 0 */}
      <div className="flex gap-2 md:order-1 items-center">
        {currentUser && (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="relative">
                <MdOutlineNotificationsActive className="text-3xl cursor-pointer" />
                <span className="absolute top-[-13px] right-0 text-xs bg-red-500 rounded-full px-1 text-white font-medium">
                  {unreadCount}
                </span>
              </div>
            }
          >
            <DropdownHeader className="flex items-center justify-between">
              <span className="font-medium text-gray-600">
                {notifications.length === 0
                  ? "No notifications"
                  : "Notifications"}
              </span>
              {notifications.length > 0 && (
                <span
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-green-400 hover:underline cursor-pointer"
                >
                  Mark all as read
                </span>
              )}
            </DropdownHeader>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification._id}>
                  <DropdownItem
                    onClick={() => handleMarkAsRead(notification._id)}
                    className={`flex flex-col items-start gap-2 ${
                      !notification.isRead && "bg-gray-100"
                    }`}
                  >
                    <span className="text-xs text-yellow-500">
                      {moment(notification.createdAt)
                        .fromNow()
                        .charAt(0)
                        .toUpperCase() +
                        moment(notification.createdAt).fromNow().slice(1)}
                    </span>
                    <div className="flex items-center justify-between w-full">
                      <span className="bg-teal-500 px-2 py-1 rounded-xl text-white font-medium">
                        {notification.type}
                      </span>
                      {notification.isRead ? (
                        <span className="text-xs italic underline text-green-500">
                          Seen
                        </span>
                      ) : (
                        <span className="text-xs italic underline text-red-500">
                          Unread
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        className="w-9 h-9 rounded-full"
                        src={notification.sender.profilePicture}
                        alt=""
                      />
                      <p>{notification.message}</p>
                    </div>
                  </DropdownItem>
                  <DropdownDivider />
                </div>
              ))}
            </div>
          </Dropdown>
        )}
        <Button pill color="light" onClick={() => dispatch(themeToggle())}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture}
                rounded
                className="cursor-pointer"
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm truncate">
                {currentUser.username}
              </span>
              <span className="block text-sm truncate font-medium">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to={"/dashboard?tab=profile"}>
              <DropdownItem icon={CgProfile}>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem icon={HiLogout} onClick={handleSignOut}>
              Sign out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button className="bg-gradient-to-br from-green-400 to-blue-600 text-white hover:bg-gradient-to-bl focus:ring-green-200 dark:focus:ring-green-800">
              Sign In
            </Button>
          </Link>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink as={"div"} active={path === "/"}>
          <Link to={"/"}>Home</Link>
        </NavbarLink>
        <NavbarLink as={"div"} active={path === "/about"}>
          <Link to={"/about"}>About</Link>
        </NavbarLink>
        <NavbarLink as={"div"} active={path === "/posts"}>
          <Link to={"/posts"}>Posts</Link>
        </NavbarLink>
        {currentUser?.role === "reader" && (
          <NavbarLink
            className="cursor-pointer"
            as={"div"}
            onClick={() => setShowModal(true)}
          >
            Request to role
          </NavbarLink>
        )}
      </NavbarCollapse>
      {showModal && (
        <Modal
          show={showModal}
          size="lg"
          popup
          onClose={() => setShowModal(false)}
        >
          <ModalHeader />
          <ModalBody className="text-center flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-red-500">
              Request Role Upgrade
            </h2>
            <p className="text-gray-500 text-sm">
              Your request will be considered by the admin, and then you will be
              answered with a notice.
            </p>
            <form className="flex flex-col gap-4">
              <Textarea
                id="message"
                rows={3}
                placeholder="Please explain why you would like to change your role..."
              />
              <Button
                color={"teal"}
                outline
                type="submit"
                className="cursor-pointer"
              >
                Send Request
              </Button>
            </form>
          </ModalBody>
        </Modal>
      )}
    </Navbar>
  );
}
