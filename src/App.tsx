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
  ProjectManagerProjects,
  ProjectManagerProducts,
  ProjectManagerLayout,
  ProjectManagerCustomers
} from "./pages/project-manager-page";



// STORE KEEPER IMPORT ROUTE
import {
  StoreKeeperDashboard,
  StoreKeeperLayout,
} from "./pages/store-keeper-page";

import { ShopDashboard,ShopSharedLayout } from "./pages/shop";
import EditPayment from "./pages/admin/paid/_pages/EditPayment";
import AddPayment from "./pages/admin/paid/_pages/AddPayment";
import AddSalaryWorker from "./pages/admin/workers/_pages/_salaryWorkers/AddSalaryWorker";
import AddContractor from "./pages/admin/workers/_pages/_contractors/AddContractor";
import EditSalaryWorker from "./pages/admin/workers/_pages/_salaryWorkers/EditSalaryWorker";
import EditContractor from "./pages/admin/workers/_pages/_contractors/EditContractor";
import SalaryWorkerRecords from "./pages/admin/workers/_records/_salaryWorksRecords/SalaryWorkersecord";
import ContractorRecords from "./pages/admin/workers/_records/_contractorsRecords/ContractorRecords";
import ForgotPassword from "./pages/AuthPages/forgotPassword/ForgotPassword";
import AddProject from "./pages/ceo/allProjects/_pages/AddProject";
import EditProject from "./pages/ceo/allProjects/_pages/EditProject";
import OtherProductionRecords from "./pages/ceo/allProjects/_pages/OtherProductionRecords";


const router =  
createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  // CEO DASHBOARD ROUTE
  {
    path: "/ceo",
    element: <CEOSharedLayout />,
    children: [
      {
         path: "dashboard",
        element: <CEODashboard />,
      },
      {
        path: "projects",
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
        element: <CEOAssets />,
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
        path: "overhead",
        element: <CEOOverhead />,
      },
      {
        path: "expenses",
        element: <CEOExpenses />,
      },
      {
        path: "shop",
        element: <CEOShop />,
      },
      {
        path: "add-project",
        element: <AddProject />,
      },
      {
        path: "edit-project/:id",
        element: <EditProject />,
      },
      {
        path: "projects/:projectId/records",
        element: <OtherProductionRecords />,
      },
    ],
  } ,
  

  // FACTORY MANAGER ROUTE 
  {
    path: "/factory-manager",
    element: <FactoryManagerSharedLayout />,
    children: [
      {
        path: "dashboard",
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
        path: "dashboard",
        element: <ProjectManagerDashboard />,
      },
      {
        path: "projects",
        element: <ProjectManagerProjects />,
      },
      {
        path: "products",
        element: <ProjectManagerProducts />,
      },
      {
        path: "customers",
        element: <ProjectManagerCustomers />,
      },
    ],
  },
 
  // STORE KEEPER ROUTE
  {
    path: "/store-keeper",
    element: <StoreKeeperLayout />,
    children: [
      {
        path:"dashboard",
        element: <StoreKeeperDashboard />,
      },
      
    ],
  },

   // SHOP ROUTE
   {
    path: "/shop",
    element: <ShopSharedLayout />,
    children: [
      {
       path : "dashboard",
        element: <ShopDashboard />,
      },
      
    ],
  },

  //admin dashboard 
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path :"dashboard",
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
        path: "add-payment",
        element: <AddPayment />,
      },
      {
        path: "edit-payment/:id",
        element: <EditPayment />,
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
      {
        path: "add-worker",
        element: <AddSalaryWorker />,
      },
      {
        path: "add-contractor",
        element: <AddContractor />,
      },
      {
        path: "edit-worker/:id",
        element: <EditSalaryWorker />,
      },
      {
        path: "edit-contractor/:id",
        element: <EditContractor />,
      },
      {
        path: "salary-workers/:id/records",
        element: <SalaryWorkerRecords />,
      },
      {
        path: "contractors/:id/records",
        element: <ContractorRecords/>,
      },
   
    ],
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router= {router} />
    </>
  );
};

export default App;