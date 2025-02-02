import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBox,
  faInfoCircle,
  faEnvelope,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { Dashboard } from "../pages/ceo";
import Products from "../pages/shop/Products";
import About from "../pages/shop/About";
import Contact from "../pages/shop/Contact";
import { AllProjects } from "../pages/ceo";

const Shop = () => {
  document.title = 'Shop'
  
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
      icon: <FontAwesomeIcon className="text-xl" icon={faHome} />,
    },
    {
      id: "2",
      text: "All Projects",
      href: "/shop/all-projects",
      name: "All Projects",
      link: "/shop/all-projects",
      icon: <FontAwesomeIcon className="text-xl" icon={faToolbox} />,
    },
    {
      id: "3",
      text: "Products",
      href: "/shop/products",
      name: "Products",
      link: "/shop/products",
      icon: <FontAwesomeIcon className="text-2xl pr-1" icon={faBox} />,
    },
    {
      id: "4",
      text: "About Us",
      href: "/shop/about",
      name: "About Us",
      link: "/about",
      icon: <FontAwesomeIcon className="text-2xl pr-[2px]" icon={faInfoCircle} />,
    },
    {
      id: "5",
      text: "Contact",
      href: "/shop/contact",
      name: "Contact",
      link: "/contact",
      icon: <FontAwesomeIcon className="text-2xl pr-[2px]" icon={faEnvelope} />,
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
          title="Welcome, Shopper"
        />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/all-projects" element={<AllProjects />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
};

export default Shop;
