import { SidebarProps } from "../utils/data-json";
import clsx from "clsx";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { LogoutIcon, SettingsIcon } from "../utils/SvgIcons";

interface SidebarProp {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  data: SidebarProps[];
}

const Sidebar = ({ isSidebarOpen, toggleSidebar, data }: SidebarProp) => {
  const location = useLocation();

  // Define all routes that should keep "All Projects" active for Project Manager and CEO
  const allProjectsRoutes = [
    "/project-manager/dashboard/all-projects",
    "/project-manager/dashboard/active-projects",
    "/project-manager/dashboard/completed-projects",
    "/project-manager/dashboard/cancelled-projects",
  ];
  
  const ceoRoutes = [
    "/ceo/dashboard/all-projects",
    "/ceo/dashboard/active-projects",
    "/ceo/dashboard/completed-projects",
    "/ceo/dashboard/cancelled-projects",
  ];

  return (
    <aside
      className={clsx(
        `fixed bg-gray-10 lg:relative top-0 bottom-0 z-50 lg:z-0 h-screen max-h-screen overflow-hidden transition-all ease-in-out duration-600`,
        isSidebarOpen
          ? "lg:ml-0 lg:w-[240px] -ml-[1000px]"
          : "lg:w-[64px] w-full sm:w-[240px] lg:ml-0"
      )}
    >
      {/* LOGO */}
      <div className="flex justify-between flex-col h-full pt-2 pb-4">
        <Logo isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* DASHBOARD LINKS */}
        <ul className="">
          {data.map((item) => {
            const { id, text, href: url, icon: img } = item;

            // Check if the current path should highlight "All Projects" for both Project Manager and CEO
            const isAllProjectsActive =
              text.toLowerCase() === "all projects" &&
              (allProjectsRoutes.includes(location.pathname) ||
                ceoRoutes.includes(location.pathname));

            return (
              <li key={id} className="mx-1 md:mx-0">
                <NavLink
                  to={url}
                  className={({ isActive }) =>
                    clsx(
                      "flex gap-3 items-center hover:bg-gray-200 rounded-md relative font-medium text-lg capitalize transition-all h-[60px] duration-500 text-gray-700",
                      (isActive || isAllProjectsActive) &&
                        "!text-blue-400 before:content-[''] before:h-full before:w-[6px] before:rounded-r-full before:bg-blue-400 before:absolute before:left-1 before:top-0 before:bottom-0",
                      isSidebarOpen
                        ? "pl-6"
                        : "lg:justify-center justify-start pl-6 lg:pl-0",
                      "hover:text-blue-400"
                    )
                  }
                  end
                >
                  {img}
                  <p
                    className={clsx(
                      `transition-all duration-400 ease-in-out`,
                      isSidebarOpen ? "block" : "block lg:hidden"
                    )}
                  >
                    {text}
                  </p>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* SETTINGS & LOGOUT */}
        <div className={clsx("w-full", !isSidebarOpen ? "pl-0" : "pl-6")}>
          <button
            type="button"
            aria-label="Toggle menu"
            className={clsx(
              "flex gap-3 items-center w-full hover:text-blue-400 rounded-md relative font-medium text-lg transition-all h-[60px] duration-500 text-gray-700",
              !isSidebarOpen && "justify-normal md:justify-center"
            )}
          >
            <Link to={"settings"}>
              <SettingsIcon className="currentColor" />
            </Link>
            <p
              className={clsx(
                "currentColor",
                isSidebarOpen ? "block" : "block md:hidden"
              )}
            >
              <Link to={"settings"}>Settings</Link>
            </p>
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            className={clsx(
              "flex gap-3 items-center w-full hover:text-blue-400 rounded-md relative font-medium text-lg transition-all h-[60px] duration-500 text-gray-700",
              !isSidebarOpen && "justify-normal md:justify-center"
            )}
          >
            <Link to={"logout"}>
              <LogoutIcon className="currentColor" />
            </Link>
            <p
              className={clsx(
                "currentColor",
                isSidebarOpen ? "block" : "block md:hidden"
              )}
            >
              <Link to={"logout"}>Sign out</Link>
            </p>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
