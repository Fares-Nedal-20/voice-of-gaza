import React, { useEffect, useState } from "react";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import { useLocation } from "react-router-dom";
import DashUsers from "../components/DashUsers";
import DashPosts from "../components/DashPosts";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashRoleRequest from "../components/DashRoleRequest";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* left side */}
      <div className="w-full lg:w-56">
        <DashSidebar />
      </div>
      {/* right side */}
      <div className="flex-1">
        {tab === "profile" && <DashProfile />}
        {tab === "users" && <DashUsers />}
        {tab === "posts" && <DashPosts />}
        {tab === "comments" && <DashComments />}
        {tab === "dash" && <DashboardComp />}
        {tab === "role-requests" && <DashRoleRequest />}
      </div>
    </div>
  );
}
