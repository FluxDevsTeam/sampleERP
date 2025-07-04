// import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faCog, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

export interface NavBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  title: string;
}

const NavBar = ({ toggleSidebar, isSidebarOpen, title }: NavBarProps) => {
  const userRole = localStorage.getItem('user_role');

  const formatRole = (role: string | null) => {
    if (!role) return '';
    if (role === 'ceo') return 'CEO';
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formattedRole = formatRole(userRole);
  const displayTitle = title || `Welcome, ${formattedRole}`;
  
  return (
    <nav className="h-[60px] sm:h-[70px] lg:h-[77px] bg-white border-b border-gray-200 flex items-center px-3 sm:px-4 lg:px-6 w-full shadow-sm z-50">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 sm:gap-4 min-w-[180px] sm:min-w-[220px]">
          {/* Logo with built-in collapse functionality */}
          <Logo isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        
        {/* Right side content */}
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent truncate max-w-[200px] sm:max-w-none">
            {displayTitle}
          </h1>
          <div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-50 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-blue-700 font-medium">Online</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
