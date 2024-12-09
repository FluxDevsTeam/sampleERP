import { users} from "../projectUtils/header-json";
import { HiDotsVertical } from "react-icons/hi";
import userpic  from "../../../../assets/images/16.png";
import { FiFilter } from "react-icons/fi";

interface UserTableProps {
  title?: string; 
}



const UserTable: React.FC<UserTableProps> = ({ title = "Activities" }) => {
    return (
      <div className="p-6 ">
     <div className='flex justify-between items-center px-6'>   <h1 className="text-3xl font-bold py-3">{title}</h1>
       <div className="flex bg-white p-2 px-3 space-x-2 text-lg"><span className="mt-1"><FiFilter /> </span> <p className=" ">filter</p> </div>
        </div>
        <table className="table-auto bg-white w-full border-collapse">
          <thead className="bg-gray-100">
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2 ">
                  <div className="flex space-x-2">
                    <img
                      src={userpic}
                      alt="user picture"
                      className="w-[32px] h-[32px] mt-2"
                    />
                    <div className="flex flex-col">
                      <p className="text-md font-bold">{user.name}</p>
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="border px-4 py-2 text-sm text-center">{user.id}</td>
                <td className="border px-4 py-2 text-sm text-center">{user.quantity}</td>
                <td className="border px-4 py-2 text-sm text-center">
                  <button className="border rounded-full border-black p-2 px-5 ">
                    View
                  </button>
                </td>
                <td className="border px-4 py-2 flex text-sm space-x-2 text-center">
                  {user.status === "In Progress" ? (
                    <span className="w-3 h-3 bg-lime-600 border rounded-full mt-1"></span>
                  ) : (
                    <span className="w-3 h-3 bg-red-400 border rounded-full mt-1"></span>
                  )}
                  <p className="text-sm">{user.status}</p>
                </td>
                <td className="border px-4 py-2 text-sm text-center" >{user.startDate}</td>
                <td className="border px-4 py-2  text-center ">
                  <HiDotsVertical />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default UserTable;
  
