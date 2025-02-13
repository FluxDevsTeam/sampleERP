
import { HiDotsVertical } from "react-icons/hi";
import userpic  from "../../../../assets/images/16.png";
//import { FiFilter } from "react-icons/fi";
//import { useState } from "react";
import { MdCancel } from "react-icons/md";
import { Task } from "../_projectUtils/header-json";

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import FilterDropdown from "./FilterDropdown";
interface UserTableProps {
  title?: string; 
  users?: Task[];
}




const UserTable: React.FC<UserTableProps> = ({ title = "Total Projects" , users}) => {

  //const [visiblePopupIndex, setVisiblePopupIndex] = useState<number | null>(null);

  /*const togglePopup = (index: number) => {
    setVisiblePopupIndex(visiblePopupIndex === index ? null : index);
  };*/


    return (
      <div className="p-6 ">
     <div className='flex justify-between items-center px-6'>   <h1 className="text-3xl font-bold py-3">{title}</h1>
       <div> <FilterDropdown /> </div>
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
      {users?.map((user) => (
        <tr
          key={user.id}
          className="border sm:table-row flex flex-col sm:flex-row sm:space-x-0 space-y-2 sm:space-y-0"
        >
          <td className=" px-4 py-2 flex flex-col sm:flex-row sm:items-center">
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
          <td className="border px-4 py-2 text-sm text-center"><p className='p-1 bg-blue-100'>{user.id}</p></td>
          <td className="border px-4 py-2 text-sm text-center">{user.quantity}</td>
          <td className="border px-4 py-2 text-sm text-center">
          <button className="border rounded-full border-neutral-900 border-2  p-2 px-5">
             View
            </button>

          </td>
         
          <td className="px-4 py-2 flex items-center justify-center space-x-2">
  {/* Status Indicator */}
  <div className="flex items-center space-x-2">
    {user.status === "Completed" || user.status === "In Progress" ? (
      <div className="w-3 h-3 bg-gray-300 border rounded-full flex items-center justify-start overflow-hidden">
        <div
          className="bg-lime-600 h-full rounded-full"
          style={{
            width: user.status === "Completed" ? "100%" : "50%",
          }}
        ></div>
      </div>
    ) : (
      <span className="w-3 h-3 bg-red-500 border rounded-full"></span>
    )}
    <p className="text-sm">{user.status}</p>
  </div>

  {/* Additional Status Representation */}
  {user.status === "Completed" ? (
    <span className="w-10 h-2 bg-lime-600 border rounded-full"></span>
  ) : user.status === "In Progress" ? (
    <div className="w-10 h-2 bg-gray-300 rounded-full overflow-hidden">
      <div
        className="bg-lime-600 h-full rounded-full"
        style={{
          width: "50%",
        }}
      ></div>
    </div>
  ) : (
    <div className="text-red-500 flex space-x-1">
      <MdCancel />
      <MdCancel />
      <MdCancel />
    </div>
  )}
</td>


          <td className="border px-4 py-2 text-sm text-center">{user.startDate}</td>
          <td className="border px-4 py-2 text-center relative">
          <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-none"><HiDotsVertical /> </Button>
      </PopoverTrigger>
      <PopoverContent className="w-70">
        <div className="flex flex-col space-y-4 ">
          <p className="hover:text-red-300 cursor-pointer">Edit</p>
          <p className="hover:text-red-300 cursor-pointer">Delete</p>
        </div>
        
        
      </PopoverContent>
    </Popover>
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
  