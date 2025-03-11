import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  CEODashboard,
 CEOProjects,
  CEOCustomers,
 CEOStore,
 CEOWorkers,
 CEOProducts,
 CEOShop,
 CEOExpenses,
 CEOOverhead,
CEOSharedLayout,
CEOAssets,

} from "./pages/ceo";

import { Workers,AdminDashboard,Expenses,AdminLayout,Assets,Paid } from "./pages/admin";
import AddAsset from "./pages/admin/assests/_pages/AddAsset";
import EditAsset from "./pages/admin/assests/_pages/EditAsset";
import AddExpense from "./pages/admin/expenses/_pages/AddExpense";
import EditExpense from "./pages/admin/expenses/_pages/EditExpense";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignUp from "./pages/AuthPages/signup/SignUp";
import Signin from "./pages/AuthPages/signin/Signin";

import {FactoryManagerCustomers,
FactoryManagerSharedLayout,
FactoryManagerAssets,
FactoryManagerExpenses,
FactoryManagerDashboard,
FactoryManagerProducts,
FactoryManagerProjects,
FactoryManagerWorkers}
 from "./pages/factory-manager-page";


//  Project Manager Route
import {
  ProjectManagerDashboard,
  ProjectManagerAllProject,
  ProjectManagerProducts,
  ProjectManagerLayout,
  ProjectManagerCustomers
} from "./pages/project-manager-page";
//import ActiveProjects from "./pages/project-manager-page/allProjects/_projectPages/ActivePage";
//import CompletedProjects from "./pages/project-manager-page/allProjects/_projectPages/CompletedProjects";
//import CancelledProjects from "./pages/project-manager-page/allProjects/_projectPages/CancelledProjects";
import ProductDetails from "./pages/project-manager-page/products/ProductDetails";


// STORE KEEPER IMPORT ROUTE
import {
  StoreKeeperDashboard,
  StoreKeeperLayout,
} from "./pages/store-keeper-page";

import { ShopDashboard,ShopSharedLayout } from "./pages/shop";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  // CEO DASHBOARD ROUTE
  {
    path: "/ceo/dashboard",
    element: <CEOSharedLayout />,
    children: [
      {
        index: true,
        element: <CEODashboard />,
      },
      {
        path: "ceo/projects",
        element: <CEOProjects />,
      },
      {
        path: "customers",
        element: <CEOCustomers />,
      },
      {
        path: "workers",
        element: <CEOWorkers />,
      },
      {
        path: "assets",
        element: <CEOAssets/>,
      },
      {
        path: "products",
        element: <CEOProducts />,
      },
      {
        path: "store",
        element: <CEOStore />,
      },
      {
        path: "products",
        element: <CEOProducts />,
      },

     {
        path: "overhead",
        element: <CEOOverhead />,
      },
      {
        path: "products",
        element: <CEOShop />,
      },
      {
        path: "expenses",
        element: <CEOExpenses />,
      },
    ],
  },

  // FACTORY MANAGER ROUTE 
  {
    path: "/factory-manager/dashboard",
    element: <FactoryManagerSharedLayout />,
    children: [
      {
        index: true,
        element: <FactoryManagerDashboard />,
      },
      {
        path: "projects",
        element: <FactoryManagerProjects />,
      },
      {
        path: "customers",
        element: <FactoryManagerCustomers />,
      },
      {
        path: "workers",
        element: <FactoryManagerWorkers />,
      },
      {
        path: "assets",
        element: <FactoryManagerAssets/>,
      },
      {
        path: "products",
        element: <FactoryManagerProducts />,
      },
      {
        path: "expenses",
        element: <FactoryManagerExpenses />,
      },
    

    
    ],
  },



  // PROJECT MANAGER ROUTE
  {
    path: "/project-manager",
    element: <ProjectManagerLayout />,
    children: [
      {
        index: true,
        element: <ProjectManagerDashboard />,
      },
      {
        path: "projects",
        element: <ProjectManagerAllProject />,
      },
      {
        path: "products",
        element: <ProjectManagerProducts />,
      },
   
      {
        path: "product-details",
        element: <ProductDetails />,
      },
      {
        path: "customers",
        element: <ProjectManagerCustomers />,
      },
    ],
  },
 
  // STORE KEEPER ROUTE
  {
    path: "/store-keeper/dashboard",
    element: <StoreKeeperLayout />,
    children: [
      {
        index: true,
        element: <StoreKeeperDashboard />,
      },
      
    ],
  },

   // STORE KEEPER ROUTE
   {
    path: "/shop/dashboard",
    element: <ShopSharedLayout />,
    children: [
      {
        index: true,
        element: <ShopDashboard />,
      },
      
    ],
  },

  //admin dashboard 
  {
    path: "/admin/dashboard",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "assets",
        element: <Assets />,
      },
      {
        path: "expenses",
        element: <Expenses />,
      },
      {
        path: "workers",
        element: <Workers />,
      },
    
      {
        path: "paid",
        element: <Paid />,
      },
      {
        path: "add-asset",
        element: <AddAsset />,
      },
      {
        path: "edit-asset/:id",
        element: <EditAsset />,
      },
      {
        path: "add-expense",
        element: <AddExpense />,
      },
      {
        path: "edit-expense/:id",
        element: <EditExpense />,
      },
   
    ],
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
};

export default App;