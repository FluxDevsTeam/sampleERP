import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import { SidebarProps } from "../utils/data-json";

interface NavBarProps {
  children: ReactNode;
  data: SidebarProps[];
}

const GlobalLayout = ({ children, data }: NavBarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-[auto_1fr] inter">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        data={data}
      />

      <div className="flex flex-col w-full h-screen">
        <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} title="Welcome" />
        <div className="flex-1 w-full overflow-auto">{children}</div>
      </div>
    </main>
  );
};

export default GlobalLayout;
