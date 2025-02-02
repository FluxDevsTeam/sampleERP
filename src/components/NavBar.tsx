import SearchBar from "./SearchBar";
import { IoMenu } from "react-icons/io5";
export interface NavBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  title: string; // Add title prop
}

const NavBar = ({ toggleSidebar, isSidebarOpen, title='Welcome Admin' }: NavBarProps) => {
  return (
    <nav className="h-[77px] bg-blue-400 flex items-center px-2.5 w-full ">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle menu"
            className="text-gray-10 text-4xl"
            onClick={toggleSidebar}
          >
            <IoMenu />
          </button>
          {/* <Hamburger
            toggled={isSidebarOpen}
            toggle={toggleSidebar}
            color="#F8F8F8"
            rounded
          /> */}
          <h4 className="text-white font-semibold text-lg md:text-2xl whitespace-nowrap">
            {title}
          </h4>
        </div>
        <SearchBar />
      </div>
    </nav>
  );
};

export default NavBar;
