import { SidebarProps } from "../utils/data-json";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { LogoutIcon, SettingsIcon } from "../utils/SvgIcons";

interface SidebarProp {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  data: SidebarProps[];
}

const Sidebar = ({ isSidebarOpen, toggleSidebar, data }: SidebarProp) => {
  return (
    <aside
      className={clsx(
        `fixed bg-gray-10 lg:relative top-0 bottom-0 z-50 lg:z-0 h-screen max-h-screen overflow-hidden transition-all ease-in-out duration-600`,
        isSidebarOpen
          ? "lg:ml-0 lg:w-[240px] -ml-[1000px]"
          : "lg:w-[64px] w-full sm:w-[240px] lg:ml-0"
      )}
    >
      <div className="flex flex-col h-full pt-2 pb-4">
        {/* LOGO */}
        <div className="mb-6">
          <Logo isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* DASHBOARD LINKS - Now with flex-1 to take available space */}
        <ul className="flex flex-col flex-1 w-full px-2 justify-evenly">
          {data.map((item) => {
            const { id, text, href: url, icon: img } = item;

            return (
              <li key={id} className="w-full">
                <NavLink
                  to={url}
                  className={({ isActive }) =>
                    clsx(
                      "flex gap-2 items-center w-full hover:bg-gray-200 rounded-md relative font-medium text-sm transition-all h-[40px] duration-500 text-gray-700",
                      isActive &&
                        "!text-blue-400 before:content-[''] before:h-full before:w-[4px] before:rounded-r-full before:bg-blue-400 before:absolute before:left-0 before:top-0 before:bottom-0",
                      isSidebarOpen ? "pl-4" : "lg:justify-center justify-start pl-4 lg:pl-0",
                      "hover:text-blue-400"
                    )
                  }
                  end
                >
                  {img}
                  <span
                    className={clsx(
                      `transition-all duration-400 ease-in-out`,
                      isSidebarOpen ? "block" : "block lg:hidden"
                    )}
                  >
                    {text}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        
        {/* Settings and Logout section */}
        <div className={clsx("flex flex-col w-full mt-6 px-2 space-y-1")}>
          <div className="w-full">
            <Link
              to="settings"
              className={clsx(
                "flex gap-2 items-center w-full hover:bg-gray-200 rounded-md relative font-medium text-sm transition-all h-[40px] duration-500 text-gray-700",
                !isSidebarOpen ? "lg:justify-center justify-start pl-4 lg:pl-0" : "pl-4",
                "hover:text-blue-400"
              )}
            >
              <SettingsIcon className="currentColor" />
              <span className={clsx("currentColor", isSidebarOpen ? "block" : "block lg:hidden")}>
                Settings
              </span>
            </Link>
          </div>
          
          <div className="w-full">
            <Link
              to="logout"
              className={clsx(
                "flex gap-2 items-center w-full hover:bg-gray-200 rounded-md relative font-medium text-sm transition-all h-[40px] duration-500 text-gray-700",
                !isSidebarOpen ? "lg:justify-center justify-start pl-4 lg:pl-0" : "pl-4",
                "hover:text-blue-400"
              )}
            >
              <LogoutIcon className="currentColor" />
              <span className={clsx("currentColor", isSidebarOpen ? "block" : "block lg:hidden")}>
                Sign out
              </span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;