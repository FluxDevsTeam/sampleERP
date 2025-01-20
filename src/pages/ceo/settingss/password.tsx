const Password = () => {
  return (
    <div>
      <p className="text-xl font-bold">User Account Infomation</p>
      <div>
        <form className="space-y-" action="submit">
          <div className="grid grid-cols-2 gap-4">
            <label className="block mt-4" htmlFor="">
              Name
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="text"
                placeholder="name"
              />
            </label>
            <label className="block mt-4 " htmlFor="">
              Email
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="email"
                placeholder="email"
              />
            </label>
          </div>
          <p className="my-4 font-bold text-xl">Reset Password</p>
          <label className="block mt-3">Current Password</label>
          <input
            className="p-2 w-1/2 rounded-md bg-gray-200 border"
            type="password"
            placeholder="password"
          />

          <label className="block mt-3 " htmlFor="">
            new password
          </label>
          <input
            className="p-2 w-1/2 rounded-md bg-gray-200 border"
            type="password"
            placeholder="new password"
          />
          <label className="block mt-3 " htmlFor="">
            confirm new password
          </label>
          <input
            className="p-2 w-1/2 rounded-md bg-gray-200 border"
            type="password"
            placeholder="confirm new password"
          />
          <div className="w-1/2 flex justify-between md:justify-around">
            <button className="border  border-blue-10 bg-gray-200 mt-4 p-2 px-5 rounded-md">
              cancel
            </button>
            <button className="border border-blue-10 bg-blue-20 text-white mt-4 p-2 px-6 rounded-md">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password;
