import { SidebarProps } from "../utils/data-json";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Logout from "@/pages/AuthPages/logout/Logout";


interface SidebarProp {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  data: SidebarProps[];
}

const Sidebar = ({ isSidebarOpen, toggleSidebar, data }: SidebarProp) => {
  // Function to handle link clicks
  const handleLinkClick = () => {
    // Close sidebar on mobile (less than 1024px width)
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

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

        {/* DASHBOARD LINKS */}
        <ul className="flex flex-col flex-1 w-full px-2 ">
          {data.map((item) => {
            const { id, text, href: url, icon: img } = item;

            return (
              <li key={id} className="w-full">
                <NavLink
                  to={url}
                  onClick={handleLinkClick}
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
        <div className={clsx("mt-auto", isSidebarOpen ? "px-4" : "px-2")}>
           <Logout isSidebarOpen={isSidebarOpen} />
        </div>
       
      
      </div>
    </aside>
  );
};

export default Sidebar;