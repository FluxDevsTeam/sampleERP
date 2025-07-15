import { SidebarProps } from "../utils/data-json";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Logout from "@/pages/AuthPages/logout/Logout";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface SidebarProp {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  data: SidebarProps[];
}

const Sidebar = ({ isSidebarOpen, toggleSidebar, data }: SidebarProp) => {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const location = useLocation();

  // Helper to recursively find the parent dropdown id(s) for the current path
  function findParentDropdowns(items, pathname, parents = []) {
    for (const item of items) {
      if (item.isDropdown && item.dropdownItems) {
        const found = findParentDropdowns(item.dropdownItems, pathname, [...parents, item.id]);
        if (found.length) return found;
      } else if (item.href && pathname.startsWith(item.href)) {
        return parents;
      }
    }
    return [];
  }

  // Open the dropdown containing the current route on mount and when route changes
  useEffect(() => {
    const parents = findParentDropdowns(data, location.pathname);
    setOpenDropdowns(parents);
  }, [location.pathname, data]);

  // NEW: When sidebar is opened, also open the dropdown for the current route
  useEffect(() => {
    if (isSidebarOpen) {
      const parents = findParentDropdowns(data, location.pathname);
      setOpenDropdowns(parents);
    }
    // No need to close dropdowns when closing sidebar (preserve state)
    // eslint-disable-next-line
  }, [isSidebarOpen]);

  // Function to handle link clicks
  const handleLinkClick = () => {
    // Close sidebar on mobile (less than 1024px width)
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  // Function to toggle dropdown
  const toggleDropdown = (id: string) => {
    // If sidebar is closed, open it first and open the dropdown immediately
    if (!isSidebarOpen) {
      toggleSidebar();
      setOpenDropdowns(prev =>
        prev.includes(id)
          ? prev.filter(dropdownId => dropdownId !== id)
          : [...prev, id]
      );
      return;
    }
    setOpenDropdowns(prev =>
      prev.includes(id)
        ? prev.filter(dropdownId => dropdownId !== id)
        : [...prev, id]
    );
  };

  // Function to render sidebar item
  const renderSidebarItem = (item: SidebarProps, isDropdownItem = false) => {
    const { id, text, href, icon, isDropdown, dropdownItems } = item;
    const isDropdownOpen = openDropdowns.includes(id);

    if (isDropdown && dropdownItems) {
      return (
        <li key={id} className="w-full">
          <button
            onClick={() => toggleDropdown(id)}
            className={clsx(
              "flex gap-3 items-center w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl relative font-medium text-sm transition-all duration-300 h-[48px] text-gray-700 group",
              isSidebarOpen ? "pl-4 pr-3" : "lg:justify-center justify-start pl-4 lg:pl-0 lg:pr-0",
              "hover:text-blue-600 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-center w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
              {icon}
            </div>
            <span
              className={clsx(
                `transition-all duration-300 font-medium`,
                isSidebarOpen ? "block" : "block lg:hidden"
              )}
            >
              {text}
            </span>
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronDown : faChevronRight}
              className={clsx(
                "ml-auto transition-all duration-300 text-gray-400 group-hover:text-blue-600",
                isSidebarOpen ? "block" : "hidden",
                isDropdownOpen && "rotate-90"
              )}
            />
          </button>
          {isDropdownOpen && (
            <ul className={clsx(
              "ml-4 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
              isSidebarOpen ? "block" : "hidden"
            )}>
              {dropdownItems.map((dropdownItem) => renderSidebarItem(dropdownItem, true))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={id} className={clsx("w-full", isDropdownItem && "ml-4")}>
        <NavLink
          to={href || "#"}
          onClick={handleLinkClick}
          className={({ isActive }) =>
            clsx(
              "flex gap-3 items-center w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl relative font-medium text-sm transition-all duration-300 h-[48px] text-gray-700 group",
              isActive &&
                "border-2 border-blue-400 text-blue-400 bg-blue-50/50 shadow-sm",
              isSidebarOpen ? "pl-4 pr-3" : "lg:justify-center justify-start pl-4 lg:pl-0 lg:pr-0",
              "hover:text-blue-600 hover:shadow-sm",
              isActive && "hover:bg-blue-50/70"
            )
          }
          end
        >
          <div className={clsx(
            "flex items-center justify-center w-6 h-6 transition-colors duration-200",
            "text-gray-500 group-hover:text-blue-600",
            "group-[.active]:text-blue-600"
          )}>
            {icon}
          </div>
          <span
            className={clsx(
              `transition-all duration-300 font-medium`,
              isSidebarOpen ? "block" : "block lg:hidden"
            )}
          >
            {text}
          </span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside
      className={clsx(
        `bg-white fixed lg:relative top-[60px] sm:top-[70px] lg:top-0 bottom-0 z-50 lg:z-0 h-full max-h-full overflow-hidden transition-all ease-in-out duration-500 shadow-xl lg:shadow-lg`,
        isSidebarOpen
          ? "lg:ml-0 lg:w-[250px] w-[280px] sm:w-[320px] left-0"
          : "lg:w-[80px] w-0 -left-full lg:left-0 lg:ml-0"
      )}
    >
      <div className="flex flex-col h-full pt-4 md:pb-6 bg-gradient-to-b from-white to-gray-50/30">
        {/* DASHBOARD LINKS */}
        <ul className="flex flex-col flex-1 w-full px-3 space-y-2 overflow-y-auto">
          {data.map((item) => renderSidebarItem(item))}
        </ul>
        
        {/* LOGOUT */}
        <div className={clsx("px-3 mb-20 lg:mb-4 mt-6", isSidebarOpen ? "px-4" : "px-3")}> 
           <Logout isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;