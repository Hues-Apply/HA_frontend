import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Sparkles,
  FileText,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";

export default function SidebarWrapper() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(true);

  const personalInfo = {
    name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "User",
    email: user?.email || "email@example.com",
  };

  const isActiveRoute = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile menu button - Fixed positioning */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[60] p-3 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile Overlay - Higher z-index */}
      {mobileOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-[45] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Fixed z-index and proper positioning */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 h-full bg-[#f0f8fd] text-gray-800 
          flex flex-col border-r border-gray-200 shadow-xl lg:shadow-sm
          transition-all duration-300 ease-in-out w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16 flex-shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <img src="/hero/hues_apply_logo.svg" className="h-8 flex-shrink-0" alt="Hues Apply" />
            <span className="text-lg font-bold text-gray-900 truncate">Hues Apply</span>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content - Properly scrollable */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              <SidebarItem 
                icon={<Home size={20} />} 
                text="Home" 
                link="/" 
                active={isActiveRoute("/")}
              />
              <SidebarItem 
                icon={<LayoutDashboard size={20} />} 
                text="Dashboard" 
                link="/dashboard"
                active={isActiveRoute("/dashboard")}
              />
              <SidebarItem 
                icon={<Sparkles size={20} />} 
                text="My AI Matches" 
                link="/ai-matches"
                active={isActiveRoute("/ai-matches")}
              />
              <SidebarItem 
                icon={<FileText size={20} />} 
                text="Saved Jobs" 
                link="/saved-jobs"
                active={isActiveRoute("/saved-jobs")}
              />
              <SidebarItem 
                icon={<Search size={20} />} 
                text="Progress Tracker" 
                link="/progress"
                active={isActiveRoute("/progress")}
              />
              
            </ul>
          </nav>
          
          {/* Bottom Navigation */}
          <div className="flex-shrink-0 p-3 border-t border-gray-100">
            <ul className="space-y-1">
              <SidebarItem 
                icon={<User size={20} />} 
                text="Profile" 
                link="/profile"
                active={isActiveRoute("/profile")}
              />
              <SidebarItem 
                icon={<Settings size={20} />} 
                text="Settings" 
                link="/settings"
                active={isActiveRoute("/settings")}
              />
              <SidebarItem 
                icon={<HelpCircle size={20} />} 
                text="Help Center" 
                link="/help"
                active={isActiveRoute("/help")}
              />
              <SidebarItem
                icon={<LogOut size={20} />}
                text="Sign out"
                onClick={handleLogout}
              />
            </ul>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : 'N'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {personalInfo.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {personalInfo.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Proper flex layout */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${expanded ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  link?: string;
  onClick?: (e: React.MouseEvent) => void;
}

function SidebarItem({
  icon,
  text,
  active = false,
  link,
  onClick,
}: SidebarItemProps) {
  const baseClasses = `
    group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg 
    transition-all duration-200 cursor-pointer
    ${
      active
        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    }
  `;

  const content = (
    <>
      <div className={`flex-shrink-0 ${active ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`}>
        {icon}
      </div>
      
      <span className="ml-3">
        {text}
      </span>
    </>
  );

  if (link && link !== "#") {
    return (
      <li>
        <Link to={link} onClick={onClick} className={baseClasses}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div onClick={onClick} className={baseClasses}>
        {content}
      </div>
    </li>
  );
}