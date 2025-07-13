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

export default function Header() {
  const path = useLocation().pathname;
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <Navbar className="border-b border-gray-300 shadow-md">
      <Link to={"/"}>
        <img
          src="/logo-_1_.svg"
          alt="logo"
          className=" h-10 w-14 rounded-full object-contain"
        />
      </Link>
      <form onSubmit={handleSubmitSearch} className="hidden md:inline">
        <TextInput
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
        />
      </form>
      <Link to={"/search"}>
        <Button pill color="light" className="inline md:hidden">
          <AiOutlineSearch />
        </Button>
      </Link>
      {/* for any tag, his order is 0 */}
      <div className="flex gap-2 md:order-1">
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
      </NavbarCollapse>
    </Navbar>
  );
}
