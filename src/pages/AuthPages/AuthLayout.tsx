import { ReactNode } from "react";
import { route } from "../../assets";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="w-full max-w-[1280px] py-8 px-4 gap-8 h-screen  flex md:justify-center items-center bg-white mx-auto">
      <div className="size-[602px] hidden lg:block rounded-full">
        <img
          src={route}
          alt="route_img"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="w-full lg:w-[524px] h-full relative">
        <div className="w-full h-full hidden md:block absolute top-0 right-0 lg:hidden rounded-full">
          <img
            src={route}
            alt="route_img"
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <div className="max-w-[524px] flex justify-center h-full items-center mx-auto  relative z-20  w-full">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
