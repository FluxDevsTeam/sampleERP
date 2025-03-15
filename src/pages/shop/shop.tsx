import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMoneyBill,
  faPlusCircle,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import Inventory from "./Dashboard";
import Dashboard from "./Inventory";
import EditItemPage from "./shop-components/Inventory Item Components/EditItemPage";
import AddItemPage from "./shop-components/Inventory Item Components/AddNewItemPage";
import AddCategoryPage from "./shop-components/Inventory Item Components/AddNewCategory";

import Sold from "./Sold";
import AddNewSoldItemPage from "./shop-components/Sold Components/AddNewSoldItemPage";
import EditSoldItemPage from "./shop-components/Sold Components/EditSoldItemPage";

import Stock from "./Stock";
import AddNewStockPage from "./shop-components/Stock Components/AddNewStock";
import EditStockItemPage from "./shop-components/Stock Components/EditStockItemPage";

const Shop = () => {
  document.title = "Shop";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarOptions = [
    {
      id: "1",
      text: "Dashboard",
      href: "/shop/dashboard",
      name: "Dashboard",
      // link: "/shop/dashboard",
      icon: <FontAwesomeIcon className="text-[22px]" icon={faHome} />,
    },
    {
      id: "2",
      text: "Inventory",
      href: "/shop/inventory",
      name: "Inventory",
      // link: "/shop/inventory",
      icon: (
        <FontAwesomeIcon
          className="text-2xl pr-[7.3px] ml-[2px]"
          icon={faReceipt}
        />
      ),
    },
    {
      id: "4",
      icon: <FontAwesomeIcon className="text-2xl pr-1" icon={faMoneyBill} />,
      text: "Sold",
      href: "/shop/sold",
      name: "Sold",
      // link: "/shop/sold",
    },
    {
      id: "5",
      icon: <FontAwesomeIcon className="text-2xl pr-1" icon={faPlusCircle} />,
      text: "Stock Added",
      href: "/shop/stock",
      name: "Stock Added",
      // link: "/shop/sold",
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
          <Route path="/inventory" element={<Dashboard />} />
          <Route path="/add-new-item" element={<AddItemPage />} />
          <Route path="/add-new-category" element={<AddCategoryPage />} />
          <Route path="/edit-item/:id" element={<EditItemPage />} />
          <Route path="/dashboard" element={<Inventory />} />
          <Route path="/sold" element={<Sold />} />
          <Route path="/add-new-sold-item" element={<AddNewSoldItemPage />} />
          <Route path="/edit-sold-item/:id" element={<EditSoldItemPage />} />
          <Route path="/stock/" element={<Stock />} />
          <Route path="/add-new-stock-item" element={<AddNewStockPage />} />
          <Route path="/edit-stock-item/:id" element={<EditStockItemPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Shop;
