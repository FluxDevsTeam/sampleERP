import { Logo as img } from "../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface LogoProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Logo = ({ isSidebarOpen, toggleSidebar }: LogoProps) => {
  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 group min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px]"
    >
      <img 
        src={img} 
        alt="logo" 
        className={clsx(
          "object-contain transition-all duration-300",
          isSidebarOpen ? "h-[35px] sm:h-[40px] lg:h-[45px]" : "h-[30px] sm:h-[32px] lg:h-[35px]"
        )} 
      />
      <FontAwesomeIcon 
        icon={isSidebarOpen ? faChevronLeft : faChevronRight} 
        className={clsx(
          "text-gray-500 group-hover:text-blue-600 transition-all duration-200",
          isSidebarOpen ? "text-xs sm:text-sm" : "text-xs"
        )}
      />
    </button>
  );
};

export default Logo;
