import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const SharedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-[auto_1fr] inter">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col w-full h-screen">
        <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 w-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default SharedLayout;
