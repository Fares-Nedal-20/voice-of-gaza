import {
  Button,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSun } from "react-icons/fa";

export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b border-gray-300 shadow-md">
      <Link to={"/"}>
        <img
          src="/logo.png"
          alt="logo"
          className="h-9 w-16 rounded-lg object-cover bg-gray-400"
        />
      </Link>
      <form className="hidden md:inline">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
        />
      </form>
      <Link to={"/search"}>
        <Button pill color="light" className="inline md:hidden">
          <AiOutlineSearch />
        </Button>
      </Link>
      {/* for any tag, his order is 0 */}
      <div className="flex gap-2 md:order-1">
        <Button pill color="light">
          <FaSun />
        </Button>
        <Link to={"/sign-in"}>
          <Button className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800">
            Sign In
          </Button>
        </Link>
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
