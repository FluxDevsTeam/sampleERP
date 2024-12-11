// import { Link } from "react-router-dom";
import Account from "./account";
import Delete from "./delete";
import Password from "./password";
import Profile from "./profile";
import { useState } from "react";

const Settings = () => {
  const [activePage, setActivePage] = useState("profile");

  return (
    <div className="bg-gray-200 w-full h-full ">
      <p className="text-2xl font-bold p-4">Account settings</p>
      <div className="flex flex-row justify-between md:gap-4">
        <div className="p-2 m-4 bg-white rounded-md col-span-2 h-1/3 ">
          <ul className="p-2  text-black font-semibold  ">
            <li className="active:border-l-4 border-blue-100 pl-2 mb-2 active:text-blue-100">
              <button onClick={() => setActivePage("profile")}>
                Profile name
              </button>
            </li>
            <li className="active:border-l-4 border-blue-100 pl-2 my-2 active:text-blue-100">
              <button onClick={() => setActivePage("password")}>
                password
              </button>
            </li>
            <li className="active:border-l-4 border-blue-100 pl-2 my-2 active:text-blue-100">
              <button onClick={() => setActivePage("account")}>
                {" "}
                Account Verification{" "}
              </button>
            </li>
            <li className="active:border-l-4 border-blue-100 pl-2 my-3 active:text-blue-100">
              <button onClick={() => setActivePage("delete")}> Delete </button>
            </li>
          </ul>
        </div>
        <div className="col-span-4 bg-white flex-1 m-4 rounded-md p-2">
          {activePage === "profile" && <Profile />}
          {activePage === "password" && <Password />}
          {activePage === "account" && <Account />}
          {activePage === "delete" && <Delete />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
