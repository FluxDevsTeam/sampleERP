import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTableCells } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";

import Dashboard from "./Dashboard components/Dashboard";

import ProductsTable from "./Product components/ProductsTable";
import AddNewProductPage from "./Product components/AddNewProduct";
import AddContractorPage from "./Product components/AddContractorPage";
import AddWorkerPage from "./Product components/AddWorkerPage";
import EditProduct from "./Product components/EditProduct";

const Product = () => {
  document.title = "Product";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarOptions = [
    {
      id: "1",
      text: "Dashboard",
      href: "/product/dashboard",
      name: "Dashboard",
      //   link: "/product/dashboard",
      icon: <FontAwesomeIcon className="text-[22px]" icon={faHome} />,
    },
    {
      id: "2",
      text: "Projects",
      href: "/product/main",
      icon: <FontAwesomeIcon className="text-[22px]" icon={faTableCells} />,
    },
  ];

  return (
    <div className="flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        data={sidebarOptions}
      />
      <div className="w-full">
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          title="Welcome, Mr. Product"
        />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/main" element={<ProductsTable />} />
          <Route path="/add-product" element={<AddNewProductPage />} />
          <Route path="/add-contractor/:id" element={<AddContractorPage />} />
          <Route path="/add-worker/:id" element={<AddWorkerPage />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Routes>
      </div>
    </div>
  );
};

export default Product;
