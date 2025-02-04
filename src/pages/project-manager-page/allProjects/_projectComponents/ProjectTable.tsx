import { project } from "../_projectUtils/header-json";
import userpic from "../../../../assets/images/16.png";



const ProjectTable: React.FC= () => {


  

  // Filter users to only include those with "In Progress" status


  return (
    <div className="md:w-[97%] w-full pb-10 bg-gray-100 px-3 md:my-10">
      <div className="overflow-x-auto">
        <table className="table-auto bg-white w-full border-collapse">
          <thead className="bg-gray-100 hidden sm:table-header-group">
            <tr>
              
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Order Assign To</th>
              <th className="border px-4 py-2">Order/No</th>
              <th className="border px-4 py-2">Order Id</th>
             
            </tr>
          </thead>
          <tbody>
            {project.map((user) => (
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
                <td className="border px-4 py-2 text-sm text-center">{user.order}</td>
                <td className="border px-4 py-2 text-sm text-center "><p className='p-1 bg-blue-100 border rounded-sm'>{user.orderNo}</p></td>
                <td className="px-4 py-2 flex items-center justify-center space-x-2">
                  <p className="text-sm mb-4">{user.id}</p> 
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
