import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Dashboard,
  AllProjects,
  Customers,
  Finances,
  Requests,
  SharedLayout,
  Archives,

} from "./pages/ceo";
//import CeoActiveProjects from "./pages/ceo/allProjects/_projectPages/ActiveProjects";
//import CeoCompletedProjects from "./pages/ceo/allProjects/_projectPages/CompletedProjects";
//import CeoCancelledProjects from "./pages/ceo/allProjects/_projectPages/CeoCancelledProjects";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./pages/ceo/settingss/settings";

import Staffs from "./pages/ceo/staffs/staffs";
import SignUp from "./pages/AuthPages/signup/SignUp";
import Signin from "./pages/AuthPages/signin/Signin";
//  Project Manager Route
import {
  ProjectManagerArchives,
  ProjectManagerDashboard,
  ProjectManagerSettings,
  ProjectManagerAllProject,
  Products,
  ProjectManagerFinances,
  ProjectManagerRequests,
  ProjectManagerStaffs,
  ProjectManagerLayout,
  ProjectManagerCustomers
} from "./pages/project-manager-page";
//import ActiveProjects from "./pages/project-manager-page/allProjects/_projectPages/ActivePage";
//import CompletedProjects from "./pages/project-manager-page/allProjects/_projectPages/CompletedProjects";
//import CancelledProjects from "./pages/project-manager-page/allProjects/_projectPages/CancelledProjects";
import ProductDetails from "./pages/project-manager-page/products/ProductDetails";

// ARTISAN IMPORT ROUTE
import {
  ArtisanDashboard,
  ArtisanLayout,
  ArtisanPayment,
  ArtisanSetting,
} from "./pages/artisan-page";

// STORE KEEPER IMPORT ROUTE
import {
  StoreKeeperDashboard,
  StoreKeeperLayout,
  Orders,
  RawMaterial,
  StoreKeeperSettings,
} from "./pages/store-keeper-page";

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
    element: <SharedLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "all-projects",
        element: <AllProjects />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "finances",
        element: <Finances />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
      // {
      //   path: "unindexed-files",
      //   element: <UnindexedFiles />,
      // },
      {
        path: "archives",
        element: <Archives />,
      },
      {
        path: "staffs",
        element: <Staffs />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
     /* {
        path: "active-projects",
        element: <CeoActiveProjects />,
      },
      {
        path: "completed-projects",
        element: <CeoCompletedProjects />,
      },
      {
        path: "cancelled-projects",
        element: <CeoCancelledProjects />,
      },*/
    ],
  },
  // PROJECT MANAGER ROUTE
  {
    path: "/project-manager/dashboard",
    element: <ProjectManagerLayout />,
    children: [
      {
        index: true,
        element: <ProjectManagerDashboard />,
      },
      {
        path: "all-projects",
        element: <ProjectManagerAllProject />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "finances",
        element: <ProjectManagerFinances />,
      },
      {
        path: "requests",
        element: <ProjectManagerRequests />,
      },
      {
        path: "archives",
        element: <ProjectManagerArchives />,
      },
      {
        path: "staffs",
        element: <ProjectManagerStaffs />,
      },
      {
        path: "settings",
        element: <ProjectManagerSettings />,
      },
    /*  {
        path: "active-projects",
        element: <ActiveProjects />,
      },
      {
        path: "completed-projects",
        element: <CompletedProjects />,
      },
      {
        path: "cancelled-projects",
        element: <CancelledProjects />,
      }, */
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
  // ARTISAN ROUTE
  {
    path: "/artisan/dashboard",
    element: <ArtisanLayout />,
    children: [
      {
        index: true,
        element: <ArtisanDashboard />,
      },
      {
        path: "payment",
        element: <ArtisanPayment />,
      },
      {
        path: "settings",
        element: <ArtisanSetting />,
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
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "raw-materials",
        element: <RawMaterial />,
      },
      {
        path: "settings",
        element: <StoreKeeperSettings />,
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