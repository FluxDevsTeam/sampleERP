import { Logo as img } from "../assets";
import { IoClose } from "react-icons/io5";
import { NavBarProps } from "./NavBar";

const Logo = ({ toggleSidebar }: NavBarProps) => {
  return (
    <div className=" min-h-[77px] bg-gray-10 flex items-center justify-between lg:justify-center px-3  w-full">
      <img src={img} alt="logo" className="h-[50px] object-contain" />
      <button
        type="button"
        aria-label="Toggle menu"
        className="text-blue-10 text-4xl block lg:hidden"
        onClick={toggleSidebar}
      >
        <IoClose />
      </button>
    </div>
  );
};

export default Logo;
