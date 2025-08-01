import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  MouseEvent,
} from "react";
import { ChevronFirst, ChevronLast, X } from "lucide-react";
import { Link } from "react-router-dom";


interface SidebarContextType {
  expanded: boolean;
}
const SidebarContext = createContext<SidebarContextType>({ expanded: true });

interface SidebarLayoutProps {
  children: React.ReactNode;
  profileData?: { profile_picture?: string };
  personalInfo: { name?: string; email?: string };
}

export function SidebarLayout({
  children,
  profileData: _profileData,
  personalInfo,
}: SidebarLayoutProps) {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const mainItems = childrenArray.slice(0, childrenArray.length - 2);
  const bottomItems = childrenArray.slice(childrenArray.length - 2);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? "bg-opacity-50 visible" : "bg-opacity-0 invisible"
          }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 h-screen bg-white text-gray-800 flex flex-col transition-all duration-300 border-r border-gray-200 shadow-xl lg:shadow-sm
          ${expanded ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {expanded && (
            <div className="flex items-center space-x-2">
              <img src="/hero/hues_apply_logo.svg" className="h-8" alt="Hues Apply" />
              <span className="text-lg font-bold text-gray-900">Hues Apply</span>
            </div>
          )}

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          {/* Collapse button for desktop */}
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="hidden lg:flex p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <div className="flex-1 overflow-y-auto">
            {/* Main Navigation */}
            <nav className="px-3 py-4">
              <ul className="space-y-1">{mainItems}</ul>
            </nav>

            {/* Bottom Navigation */}
            <div className="mt-auto p-3 border-t border-gray-100">
              <ul className="space-y-1">{bottomItems}</ul>
            </div>
          </div>
        </SidebarContext.Provider>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : 'N'}
              </div>
            </div>
            {expanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {personalInfo.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {personalInfo.email || "email@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  link?: string;
  onClick?: (e: MouseEvent<HTMLDivElement | HTMLAnchorElement>) => void;
}

export function SidebarItem({
  icon,
  text,
  active = false,
  link,
  onClick,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  const baseClasses = `
    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
    ${active
      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    }
  `;

  const content = (
    <>
      <div className={`flex-shrink-0 ${active ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`}>
        {icon}
      </div>

      <span
        className={`ml-3 transition-all duration-300 ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
      >
        {text}
      </span>

      {/* Tooltip for collapsed state */}
      {!expanded && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {text}
        </div>
      )}
    </>
  );

  if (link && link !== "#") {
    return (
      <li className="relative">
        <Link to={link} onClick={onClick} className={baseClasses}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li className="relative">
      <div onClick={onClick} className={baseClasses}>
        {content}
      </div>
    </li>
  );
}
