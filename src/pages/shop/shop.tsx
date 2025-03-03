import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faDatabase,
  faHome,
  faMoneyBill,
  faReceipt,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import RawMaterials from "./RawMaterials";
import Sold from "./Sold";
import AddItemPage from "./shop-components/AddNewItemPage";
import AddCategoryPage from "./shop-components/AddNewCategory";
// import DashboardTable from "./shop-components/DashboardTable";

const Shop = () => {
  document.title = "Shop";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarOptions = [
    {
      id: "1",
      text: "Dashboard",
      href: "/shop/dashboard",
      name: "Dashboard",
      link: "/shop/dashboard",
      icon: <FontAwesomeIcon className="text-[22px]" icon={faHome} />,
    },
    {
      id: "2",
      text: "Orders",
      href: "/shop/orders",
      name: "Orders",
      link: "/shop/orders",
      icon: (
        <FontAwesomeIcon
          className="text-2xl pr-[7.3px] ml-[2px]"
          icon={faReceipt}
        />
      ),
    },
    {
      id: "3",
      icon: <FontAwesomeIcon className="text-2xl pr-1" icon={faTools} />,
      text: "Raw Materials",
      href: "/shop/raw-materials",
      name: "Products",
      link: "/shop/raw-materials",
    },
    {
      id: "4",
      icon: <FontAwesomeIcon className="text-2xl pr-1" icon={faMoneyBill} />,
      text: "Sold",
      href: "/shop/sold",
      name: "Sold",
      link: "/shop/sold",
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
          title="Welcome, Shopkeeper"
        />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-new-item" element={<AddItemPage />} />
          <Route path="/add-new-category" element={<AddCategoryPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/sold" element={<Sold />} />
        </Routes>
      </div>
    </div>
  );
};

export default Shop;
