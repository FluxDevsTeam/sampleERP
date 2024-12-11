const Delete = () => {
  return (
    <div>
      <p className="text-2xl font-bold">Delete</p>
      <div>
        <form className="space-y-" action="submit">
          <div className="grid grid-cols-2 gap-2">
            <label className="block mt-4" htmlFor="">
              Email Address
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="email"
                placeholder="email"
              />
            </label>
            <label className="block mt-4 " htmlFor="">
              Confirm Email
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="email"
                placeholder="email"
              />
            </label>
          </div>
          <p className="my-4 font-bold text-xl">Enter Password</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="block  " htmlFor="">
              new password
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="password"
                placeholder="new password"
              />
            </label>
            <label className="block" htmlFor="">
              confirm new password
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="password"
                placeholder="confirm new password"
              />
            </label>
          </div>
          <div className="w-1/2 flex justify-between md:justify-around">
            <button className="border  border-blue-10 bg-gray-200 mt-4 p-2 px-5 rounded-md">
              cancel
            </button>
            <button className="border border-blue-10 bg-blue-20 text-white mt-4 p-2 px-6 rounded-md">
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Delete;
