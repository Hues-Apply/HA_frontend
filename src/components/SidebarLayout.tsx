import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  MouseEvent,
} from "react";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  profileData,
  personalInfo,
}: SidebarLayoutProps) {
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();

  const childrenArray = React.Children.toArray(children);
  const topItem = childrenArray.slice(0, childrenArray.length - 4);
  const bottomItems = childrenArray.slice(childrenArray.length - 4);

  return (
    <aside className="top-0 left-0 h-screen bg-white border-r shadow-sm">
      <nav className="h-full flex flex-col bg-blue-50 border-r shadow-sm">
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-2">      
            {expanded && (
              <div className="flex items-center gap-2">
                <img
                  src={"/hero/hues_apply_logo.svg"}
                  alt="Hues Apply"
                  className="h-12 w-auto text-[#4DA5E2]"
                />
                <span className="font-bold text-lg text-[#4DA5E2]">Hues Apply</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-blue-200 hover:bg-blue-200"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Items */}
        <SidebarContext.Provider value={{ expanded }}>
          {/* {Top item} */}
          <div className="flex-1 flex flex-col">
            <ul className="flex-1 px-3 flex flex-col gap-2">{topItem}</ul>
          </div>
          {/* {Bottom Item} */}
          <ul className="px-3 flex flex-col gap-2 mb-2">{bottomItems}</ul>
        </SidebarContext.Provider>

        {/* Footer */}
        <div className="border-t flex p-3">
          <img
            src={
              profileData?.profile_picture?.trim()
                ? profileData.profile_picture
                : "/hero/userprofile.svg"
            }
            alt="User"
            className="w-10 h-10 rounded-md object-cover"
          />
          <div
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">
                {personalInfo.name || "User"}
              </h4>
              <span className="text-xs text-gray-600">
                {personalInfo.email || "email@example.com"}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
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
  alert = false,
  link,
  onClick,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  const classes = `
    relative flex items-center justify-center py-3 px-3 font-medium rounded-md cursor-pointer transition-colors group
    ${
     active
      ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
      : "hover:bg-indigo-50 text-gray-600"
    }
  `;

  const content = (
    <>
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0 ml-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </>
  );

  if (link) {
    return (
      <li className={classes}>
        <Link to={link} onClick={onClick} className="flex items-center w-full">
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li className={classes}>
      <div onClick={onClick} className="flex items-center w-full">
        {content}
      </div>
    </li>
  );
};

