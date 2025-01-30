

import { useNavigate } from "react-router-dom";
import userpic from "../../../../assets/images/16.png";




export default function ProductDetails(){

    const navigate = useNavigate()

    return (
        <div className="w-full pb-10 bg-gray-100">
             <div className="p-6 w-full my-4">
  <h1 className="text-3xl font-bold py-3 cursor-pointer" onClick={() => navigate('/dashboard/product')}> Back</h1>
  <p className="text-2xl  text-blue-200 bg-white p-2 w-fit">+ Add Product</p>
</div>
<div className="w-[70%] h-auto mx-auto  bg-white p-8">
    <div className="flex flex-col justify-center items-center space-y-4">
        <p className="text-blue-200">Dining set</p>
        <img src={userpic} alt="logo" className="w-[200px] h-[200px]"  />
     <p>Customer : <span className="text-blue-200">Loki</span> </p>   
     <p>Artisan : <span className="text-blue-200">Mike</span> </p>   
     <p>Total Cot of Production: <span className="text-blue-200">$200</span> </p>   
     <p>Status : <span className="text-blue-200">In Progress 40%</span> </p>   
     <p>Start date : <span className="text-blue-200">22nd Jan 2024</span> </p>   
     <p>End date : <span className="text-blue-200">22nd Fan 2024</span> </p>  

     <div className="flex space-x-4">
        <button className="bg-gray-200 text-red-200 p-3 border rounded-lg">Save</button>
        <button className="bg-red-200 text-gray-200 p-3 border rounded-lg">Delete</button>
     </div>
    </div>

</div>
        </div>
    )
}