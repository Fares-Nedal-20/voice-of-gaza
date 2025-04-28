import React, { useEffect, useState } from "react";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import { useLocation } from "react-router-dom";

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
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* left side */}
      <div className="w-full md:w-56">
        <DashSidebar />
      </div>
      {/* right side */}
      <div className="flex-1">
        {tab === "profile" && <DashProfile />}
      </div>
    </div>
  );
}
