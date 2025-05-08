import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiLogout, HiUser, HiTable, HiLogin } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../redux/user/userSlice";
import { FaUsers } from "react-icons/fa";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
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

  return (
    <Sidebar className="w-full">
      <SidebarLogo img="./logo2.png" imgAlt="logo" href="/">
        <span className="text-gray-700">Voice of Gaza</span>
      </SidebarLogo>
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem
            icon={HiUser}
            active={tab === "profile"}
            label={currentUser.role}
            labelColor="dark"
            as={"div"}
          >
            <Link to={"/dashboard?tab=profile"}>Profile</Link>
          </SidebarItem>
          {currentUser?.role === "admin" && (
            <SidebarItem active={tab === "users"} icon={FaUsers} as={"div"}>
              <Link to={"/dashboard?tab=users"}>Users</Link>
            </SidebarItem>
          )}
          <SidebarItem icon={HiLogin} as={"div"}>
            <Link to={"/sign-in"}>Sign in</Link>
          </SidebarItem>
          <SidebarItem icon={HiTable} as={"div"}>
            <Link to={"/sign-up"}>Sign up</Link>
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem
            className="cursor-pointer"
            icon={HiLogout}
            onClick={handleSignOut}
          >
            Sign out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
