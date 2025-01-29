import { Link } from "react-router-dom";
import { Logo } from "../../../assets";
import Button from "../../../components/Button";
import { ChromeIcon } from "../../../utils/SvgIcons";
import FormInput from "../_components/FormInput";
import AuthLayout from "../AuthLayout";
import FormHeader from "./_components/FormHeader";

const SignUp = () => {
  return (
    <AuthLayout>
      <section className="w-full h-full md:h-fit lg:h-[600px] overflow-auto px-4 py-6 space-y-4 bg-gray_2-100 shadow-xl rounded-2xl">
        <div className="w-full flex space-y-1 flex-col items-center">
          <img
            src={Logo}
            alt="logo"
            className="w-[139px] h-[57px] object-contain"
          />
          <FormHeader header="Create an account" />
        </div>

        <form action="" className="max-w-[408px] w-full mx-auto space-y-4">
          <FormInput name="name" type="text" label="Name" />
          <FormInput name="email" type="email" label="Email" />
          <FormInput name="password" type="password" label="Password" />
          <FormInput
            name="confirm_password"
            type="password"
            label="Confirm Password"
          />

          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              id="is_terms_agreed"
              name="is_terms_agreed"
              className="checkbox size-4"
            />
            <label
              htmlFor="is_terms_agreed"
              className="text-sm font-semibold text-blue-20"
            >
              Accept terms and conditions
            </label>
          </div>
          <div className="flex flex-col items-center w-full space-y-4">
            <Button className="bg-blue-400 text-white w-[278px] font-semibold text-sm py-2">
              Sign Up
            </Button>

            <div className="max-w-[278px] gap-4 w-full flex items-center">
              <div className="w-full h-[1px] bg-gray_2-200" />
              <p className="text-black-400 text-base font-medium">or</p>
              <div className="w-full h-[1px] bg-gray_2-200" />
            </div>

            <Button className="bg-white flex justify-center items-center gap-2 border border-gray_2-200 text-black-400 w-[278px] font-semibold text-sm py-2">
              <ChromeIcon />
              <p className="">Sign up with Google</p>
            </Button>
            <h2 className="text-sm font-medium text-black-400 ">
              Already have an account?{" "}
              <Link
                to={"/"}
                className="text-blue-40 hover:underline duration-500"
              >
                Sign in
              </Link>
            </h2>
          </div>
        </form>
      </section>
    </AuthLayout>
  );
};

export default SignUp;
