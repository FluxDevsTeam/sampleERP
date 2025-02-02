import userpic from "../../../assets/images/16.png";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { products } from "../allProjects/_projectUtils/header-json";

import ProjectsHeader from "../allProjects/_projectComponents/ProjectsHeader";

interface UserTableProps {
  title?: string;
}

const Products: React.FC<UserTableProps> = ({ title = "Manage Products" }) => {


  const navigate = useNavigate()




  return (
    <div className="w-full pb-10 bg-gray-100">
    <div className="p-6 w-full">
  <h1 className="md:text-3xl font-bold py-3">New Product</h1>
  <p
        className="md:text-2xl text-blue-200 bg-white p-2 w-fit cursor-pointer"
        onClick={() => navigate('/project-manager/dashboard/product-details')}
      >
        + Add Product
      </p>
</div>

      <ProjectsHeader />
      <div className="flex justify-between items-center p-6  px-6">
        <h1 className="md:text-3xl font-bold py-3">{title}</h1>
        <div className="flex bg-white p-2 px-3 space-x-2 md:text-lg">
          <span className="mt-1">
            <FiFilter />
          </span>
          <p>filter</p>
        </div>
      </div>
      <div className="overflow-x-auto w-full md:w-[99%] px-3 ">
        <table className="table-auto bg-white w-full border-collapse">
          <thead className="bg-gray-100 hidden sm:table-header-group">
            <tr>
              
              <th className="border px-4 py-2">Product id</th>
              <th className="border px-4 py-2">List of Projects</th>
              <th className="border px-4 py-2">Finished Date - Delivery Date</th>
              <th className="border px-4 py-2">Product Cost</th>
              <th className="border px-4 py-2">Expense</th>
              <th className="border px-4 py-2">Selling Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((user) => (
              <tr
                key={user.id}
                className="border sm:table-row flex flex-col sm:flex-row sm:space-x-0 space-y-2 sm:space-y-0"
              >
                <td className="border px-4 py-2 text-sm text-center">{user.id}</td>
                <td className="border px-4 py-2 flex flex-col sm:flex-row sm:items-center">
                
                  <img
                    src={userpic}
                    alt="user picture"
                    className="w-[32px] h-[32px] mt-2 sm:mr-2"
                  />
                  <div>
                    <p className="text-md font-bold">{user.name}</p>
                    <p className="text-sm">{user.desc}</p>
                  </div>
                </td>
                <td className="border px-4 py-2 text-sm text-center">{user.startDate} - {user.endDate} </td>
                <td className="px-4 py-2 flex items-center justify-center space-x-2">
                  <p className="text-sm mb-4">${user.cost}</p> 
                </td>
                <td className="border px-4 py-2 text-sm text-center">${user.expense}</td>
                <td className="border px-4 py-2 text-sm text-center">${user.selling}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
