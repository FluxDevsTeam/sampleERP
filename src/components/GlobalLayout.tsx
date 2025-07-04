import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import { SidebarProps } from "../utils/data-json";

interface NavBarProps {
  children: ReactNode;
  data: SidebarProps[];
}

const GlobalLayout = ({ children, data }: NavBarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="h-screen w-full flex flex-col">
      {/* NavBar at the top, full width */}
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} title="" />
      {/* Sidebar and content below NavBar */}
      <div className="flex flex-1 h-0 relative">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} data={data} />
        <div className="flex-1 w-full overflow-auto bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlobalLayout;
