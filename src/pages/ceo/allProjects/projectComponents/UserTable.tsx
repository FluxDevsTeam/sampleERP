import { users} from "../projectUtils/header-json";
import { HiDotsVertical } from "react-icons/hi";
import userpic  from "../../../../assets/images/16.png";
import { FiFilter } from "react-icons/fi";
import { useState } from "react";
import PopUp from "./PopUp";
import { MdCancel } from "react-icons/md";

interface UserTableProps {
  title?: string; 
}



const UserTable: React.FC<UserTableProps> = ({ title = "Activities" }) => {

  const [visiblePopupIndex, setVisiblePopupIndex] = useState<number | null>(null);

  const togglePopup = (index: number) => {
    setVisiblePopupIndex(visiblePopupIndex === index ? null : index);
  };


    return (
      <div className="p-6 ">
     <div className='flex justify-between items-center px-6'>   <h1 className="text-3xl font-bold py-3">{title}</h1>
       <div className="flex bg-white p-2 px-3 space-x-2 text-lg"><span className="mt-1"><FiFilter /> </span> <p className=" ">filter</p> </div>
        </div>
        <div className="overflow-x-auto">
  <table className="table-auto bg-white w-full border-collapse">
    <thead className="bg-gray-100 hidden sm:table-header-group">
      <tr>
        <th className="border px-4 py-2">Artisan</th>
        <th className="border px-4 py-2">Project Id</th>
        <th className="border px-4 py-2">Quantity</th>
        <th className="border px-4 py-2">View Product</th>
        <th className="border px-4 py-2">Status</th>
        <th className="border px-4 py-2">Start Date</th>
        <th className="border px-4 py-2">Edit</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr
          key={user.id}
          className="border sm:table-row flex flex-col sm:flex-row sm:space-x-0 space-y-2 sm:space-y-0"
        >
          <td className="border px-4 py-2 flex flex-col sm:flex-row sm:items-center">
            <img
              src={userpic}
              alt="user picture"
              className="w-[32px] h-[32px] mt-2 sm:mr-2"
            />
            <div>
              <p className="text-md font-bold">{user.name}</p>
              <p className="text-sm">{user.email}</p>
            </div>
          </td>
          <td className="border px-4 py-2 text-sm text-center">{user.id}</td>
          <td className="border px-4 py-2 text-sm text-center">{user.quantity}</td>
          <td className="border px-4 py-2 text-sm text-center">
          <button className="border rounded-full border-black  p-2 px-5">
             View
            </button>

          </td>
          <td className="px-4 py-2  flex items-center justify-center space-x-2">
  {user.status === "In Progress" ? (
    <span className="w-3 h-3 bg-lime-600 border rounded-full mb-4"></span>
  ) : (
    <span className="w-3 h-3 bg-red-500 border rounded-full mb-4"></span>
  )}
  <p className="text-sm mb-4">{user.status}</p>

  {user.status === "In Progress" ? (
    <span className="w-10 h-2 bg-lime-600 border rounded-full mb-4"></span>
  ) : (
    <div className="text-red-500 flex space-x-1 mb-4">
      <MdCancel />
      <MdCancel />
      <MdCancel />
    </div>
  )}
</td>


          <td className="border px-4 py-2 text-sm text-center">{user.startDate}</td>
          <td className="border px-4 py-2 text-center relative">
            <button
              onClick={() => togglePopup(index)}
              className="focus:outline-none"
            >
              <HiDotsVertical />
            </button>
            {visiblePopupIndex === index && <PopUp />}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    );
  };
  
  export default UserTable;
  
