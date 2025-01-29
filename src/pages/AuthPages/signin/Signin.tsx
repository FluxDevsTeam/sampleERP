import { Link } from "react-router-dom";
import { Logo } from "../../../assets";
import Button from "../../../components/Button";
import { ChromeIcon } from "../../../utils/SvgIcons";
import FormInput from "../_components/FormInput";
import AuthLayout from "../AuthLayout";
import FormHeader from "../signup/_components/FormHeader";

const Signin = () => {
  return (
    <AuthLayout>
      <section className="w-full h-fit overflow-auto px-4 py-6 space-y-4 bg-green-900 shadow-xl rounded-2xl">
        <div className="w-full flex space-y-1 flex-col items-center">
          <img
            src={Logo}
            alt="logo"
            className="w-[139px] h-[57px] object-contain"
          />
          <FormHeader header="Login" />
        </div>

        <form action="" className="max-w-[408px] w-full mx-auto space-y-4">
          <FormInput name="email" type="email" label="Email" />
          <h2 className="text-sm font-medium text-black-400 ">ROLE</h2>
          <div className=" w-full">
            <FormInput name="password" type="password" label="Password" />
            <div className="flex justify-end w-full">
              <Link
                to={"/"}
                className="text-blue-40 text-sm  font-semibold hover:underline duration-500 "
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center w-full space-y-4">
            <Button className="bg-blue-400 text-white w-[278px] font-semibold text-sm py-2">
              Login
            </Button>

            <div className="max-w-[278px] gap-4 w-full flex items-center">
              <div className="w-full h-[1px] bg-gray_2-200" />
              <p className="text-black-400 text-base font-medium">or</p>
              <div className="w-full h-[1px] bg-gray_2-200" />
            </div>

            <Button className="bg-white flex justify-center items-center gap-2 border border-gray_2-200 text-black-400 w-[278px] font-semibold text-sm py-2">
              <ChromeIcon />
              <p className="">Sign in with Google</p>
            </Button>
            <h2 className="text-sm font-medium text-black-400 ">
              Don&apos;t have an account?{" "}
              <Link
                to={"/signup"}
                className="text-blue-40 hover:underline duration-500"
              >
                Sign up
              </Link>
            </h2>
          </div>
        </form>
      </section>
    </AuthLayout>
  );
};

export default Signin;
