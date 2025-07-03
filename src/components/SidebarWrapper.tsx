import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarLayout, SidebarItem } from "./SidebarLayout";
import {
  Home,
  LayoutDashboard,
  Brain,
  Bookmark,
  TrendingUp,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SidebarWrapper() {
  const { logout, user } = useAuth();

  const profileData = {
    profile_picture: user?.profile_picture || "/hero/userprofile.svg",
  };

  const personalInfo = {
    name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    email: user?.email || "",
  };

  return (
    <div className="flex h-screen">
      <SidebarLayout profileData={profileData} personalInfo={personalInfo}>
        <SidebarItem icon={<Home size={20} />} text="Home" link="/" />
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" link="/dashboard" />
        <SidebarItem icon={<Brain size={20} />} text="My AI Matches" link="/ai-matches" />
        <SidebarItem icon={<Bookmark size={20} />} text="Saved Jobs" link="/saved-jobs" />
        <SidebarItem icon={<TrendingUp size={20} />} text="Progress Tracker" link="/progress" />
        <SidebarItem icon={<User size={20} />} text="Profile" link="/profile" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" link="/settings" />
        <SidebarItem icon={<HelpCircle size={20} />} text="Help Center" link="/help" />
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          link="#"
          onClick={logout}
        />
      </SidebarLayout>

      {/* Main content rendered here */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>


    </div>
  );
}
