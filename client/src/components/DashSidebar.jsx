import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiLogout, HiUser, HiTable, HiLogin } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const {currentUser} = useSelector((state) => state.user)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className="w-full">
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
          <SidebarItem icon={HiLogin} as={"div"}>
            <Link to={"/sign-in"}>Sign in</Link>
          </SidebarItem>
          <SidebarItem icon={HiTable} as={"div"}>
            <Link to={"/sign-up"}>Sign up</Link>
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem className="cursor-pointer" icon={HiLogout}>
            Sign out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
