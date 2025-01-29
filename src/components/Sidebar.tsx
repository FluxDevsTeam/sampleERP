import { SidebarProps } from "../utils/data-json";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { LogoutIcon, SettingsIcon } from "../utils/SvgIcons";
// import Logo from "../navbar/Logo";
// import {
//   MdKeyboardDoubleArrowLeft,
//   MdKeyboardDoubleArrowRight,
// } from "react-icons/md";

interface SidebarProp {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  data: SidebarProps[];
}

const Sidebar = ({ isSidebarOpen, toggleSidebar, data }: SidebarProp) => {
  return (
    <aside
      className={clsx(
        `fixed bg-gray-10 lg:relative top-0 bottom-0 z-50 lg:z-0 h-screen max-h-screen overflow-hidden transition-all ease-in-out  duration-600`,
        isSidebarOpen
          ? "lg:ml-0 lg:w-[240px] -ml-[1000px]"
          : "lg:w-[64px] w-full sm:w-[240px] lg:ml-0"
      )}
    >
      {/* LOGO*/}
      <div className="flex justify-between flex-col h-full pt-2 pb-4">
        <Logo isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* DASHBOARD LINK */}
        <ul className="">
          {data.map((item) => {
            const { id, text, href: url, icon: img } = item;

            return (
              <li key={id} className="mx-1 md:mx-0  ">
                <NavLink
                  to={url}
                  className={({ isActive }) =>
                    clsx(
                      "flex gap-3 items-center hover:bg-gray-200 rounded-md relative font-medium text-lg capitalize transition-all h-[60px] duration-500 text-gray-700",
                      isActive &&
                        "!text-blue-400 before:content-[''] before:h-full before:w-[6px] before:rounded-r-full before:bg-blue-400 before:absolute before:left-1 before:top-0 before:bottom-0",
                      isSidebarOpen
                        ? "pl-6"
                        : "lg:justify-center justify-start pl-6 lg:pl-0",
                      "hover:text-blue-400  "
                    )
                  }
                  end
                >
                  {img}
                  <p
                    className={clsx(
                      `transition-all  duration-400 ease-in-out`,
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
        <div className={clsx("w-full", !isSidebarOpen ? "pl-0" : "pl-6")}>
          <button
            type="button"
            aria-label="Toggle menu"
            className={clsx(
              "flex gap-3 items-center ju w-full hover:text-blue-400  rounded-md relative font-medium text-lg  transition-all h-[60px] duration-500 text-gray-700",
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
              "flex gap-3 items-center ju w-full hover:text-blue-400 rounded-md relative font-medium text-lg  transition-all h-[60px] duration-500 text-gray-700",
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
