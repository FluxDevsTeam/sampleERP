const Profile = () => {
  return (
    <div className="p-4 ">
      <p className="text-xl font-bold">Profile</p>
      <div className="">
        <div className="flex items-center mb-4">
          <img src="p3.PNG" className="w-6 h-16 rounded-full mr-4" />

          <button className="bg-blue-200 text-white mr-4 px-3 py-2 rounded">
            Update
          </button>
          <button className="bg-gray-200 text-white px-3 py-2 rounded">
            Remove
          </button>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block mt-4" htmlFor="">
              First Name
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="text"
                placeholder="First Name"
              />
            </label>
            <label className="block mt-4" htmlFor="">
              Last Name
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="text"
                placeholder="Last name"
              />
            </label>
            <label className="block mt-4" htmlFor="">
              Email Address
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="email"
                placeholder="email"
              />
            </label>
            <label className="block mt-4 " htmlFor="">
              Mobile Number
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="number"
                placeholder="number"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block  " htmlFor="">
              Password
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="password"
                placeholder="new password"
              />
            </label>
            <label className="block" htmlFor="">
              Confirm password
              <input
                className="p-2 w-full rounded-md bg-gray-200 border"
                type="password"
                placeholder="confirm new password"
              />
            </label>
          </div>
          <div>
            
            <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </form>
        
    
      </div>
      
    </div>
  );
};

export default Profile;
