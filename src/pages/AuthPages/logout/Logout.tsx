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
        "flex items-center p-2 rounded-lg cursor-pointer w-full",
        isSidebarOpen
          ? "bg-red-700 hover:bg-red-600 text-white justify-start"
          : "justify-center text-gray-700 hover:bg-gray-200"
      )}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
      <span
        className={clsx(
          "ml-2 font-medium text-sm",
          isSidebarOpen ? "block" : "lg:hidden"
        )}
      >
        Logout
      </span>
    </div>
  );
};

export default Logout;