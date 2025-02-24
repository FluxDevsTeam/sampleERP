import userpic from "../../../assets/images/16.png";
//import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import FilterDropdown from "./_productComponents/FilterDropdown";
import ProjectsHeader from "../allProjects/_projectComponents/ProjectsHeader";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./_productApi/FetchProducts";

interface UserTableProps {
    title?: string;
  }

  interface Product {
    id: number;
    name: string;
    quantity: number;
    progress: string;
    overhead_cost: number;
    total_production_cost: number;
    selling_price: number;
  }
  
  const Products: React.FC<UserTableProps> = ({ title = "Manage Products" }) => {
    const navigate = useNavigate();
  
    const { data, isLoading, error } = useQuery({
        queryKey: ["Products"],
        queryFn: fetchProducts ,
    
      });
      console.log(data)
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    const productList = data?.results || [];
    
  
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
          <div> <FilterDropdown /> </div>
        </div>
        <div className="overflow-x-auto w-full md:w-[99%] px-3 ">
          <table className="table-auto bg-white w-full border-collapse">
            <thead className="bg-gray-100 hidden sm:table-header-group">
              <tr>
                <th className="border px-4 py-2">List of Products</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Progress</th>
                <th className="border px-4 py-2">Product Cost</th>
                <th className="border px-4 py-2">Expense</th>
                <th className="border px-4 py-2">Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((user) => (
                <tr
                  key={user.id}
                  className="border sm:table-row flex flex-col sm:flex-row sm:space-x-0 space-y-2 sm:space-y-0"
                >
                  <td className=" px-4 py-2 flex flex-col sm:flex-row sm:items-center ">
                    <img
                      src={userpic}
                      alt="user picture"
                      className="w-[32px] h-[32px] mt-2 sm:mr-2"
                    />
                    <div>
                      <p className="text-md font-bold">{user.name}</p>
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-sm text-center">{user.quantity}</td>
                  <td className="border px-4 py-2 text-sm text-center">{user.progress}</td>
                  <td className="px-4 py-2 flex items-center justify-center space-x-2">
                    <p className="text-sm mb-4">${user.overhead_cost}</p> 
                  </td>
                  <td className="border px-4 py-2 text-sm text-center">${user.total_production_cost}</td>
                  <td className="border px-4 py-2 text-sm text-center">${user.selling_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Products;