import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";

import ProductsTable from "./ProductsTable";
import AddNewProductPage from "./AddNewProduct";
import AddContractorPage from "./AddContractorPage";
import AddWorkerPage from "./AddWorkerPage";
import EditProduct from "./EditProduct";

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
          <Route path="/dashboard" element={<ProductsTable />} />
          <Route path="/add-product" element={<AddNewProductPage />} />

          {/* <Route path="/add-contractor" element={<AddContractorPage />} /> */}
          <Route path="/add-contractor/:id" element={<AddContractorPage />} />

          {/* <Route path="/add-worker" element={<AddWorkerPage />} /> */}
          <Route path="/add-worker/:id" element={<AddWorkerPage />} />

          {/* <Route path="/edit-product" element={<EditProduct />} /> */}
          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Routes>
      </div>
    </div>
  );
};

export default Product;
