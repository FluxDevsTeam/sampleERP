// import SearchBar from "./SearchBar";
import { IoMenu } from "react-icons/io5";
export interface NavBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  title: string; // Add title prop
}

const NavBar = ({ toggleSidebar, isSidebarOpen, title }: NavBarProps) => {
  const userRole = localStorage.getItem('user_role');

  const formatRole = (role: string | null) => {
    if (!role) return '';
    if (role === 'ceo') return 'CEO';
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formattedRole = formatRole(userRole);
  const displayTitle = title === 'Welcome' ? `Welcome ${formattedRole}` : title;
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
            {displayTitle}
          </h4>
        </div>
        {/* <SearchBar /> */}
      </div>
    </nav>
  );
};

export default NavBar;
