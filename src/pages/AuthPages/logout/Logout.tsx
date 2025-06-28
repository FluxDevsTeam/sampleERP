import { useAuth } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface LogoutProps {
  isSidebarOpen: boolean;
}

const Logout = ({ isSidebarOpen }: LogoutProps) => {
  const { logout } = useAuth();

  return (
    <div
      onClick={logout}
      className={clsx(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer w-full transition-all duration-300 group",
        isSidebarOpen
          ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white justify-start shadow-lg shadow-red-500/25"
          : "justify-center text-gray-500 hover:text-red-500 hover:bg-red-50"
      )}
    >
      <div className="flex items-center justify-center w-6 h-6">
        <FontAwesomeIcon 
          icon={faRightFromBracket} 
          className={clsx(
            "transition-all duration-200",
            isSidebarOpen ? "text-white" : "text-gray-500 group-hover:text-red-500"
          )}
        />
      </div>
      <span
        className={clsx(
          "font-medium text-sm transition-all duration-300",
          isSidebarOpen ? "block" : "lg:hidden"
        )}
      >
        Logout
      </span>
    </div>
  );
};

export default Logout;