import { ReactNode } from "react";
import clsx from "clsx";
import loader from "../assets/images/loader.svg";

interface ButtonProps {
  children: ReactNode;
  type?: "submit" | "button";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}
const Button = ({
  children,
  type = "button",
  className,
  onClick,
  disabled,
  isLoading = false,
  ...rest
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...rest}
      className={clsx(
        "outline-none focus:outline-none rounded-lg hover:bg-opacity-85 duration-500 disabled:bg-opacity-70 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <img src={loader} alt="loader" className="animate-spin size-6" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
