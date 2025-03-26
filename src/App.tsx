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
  ProjectManagerCustomers,
  ProjectManagerFinances,
  ProjectManagerRequests,
  ProjectManagerStaffs,
  ProjectManagerLayout,
} from "./pages/project-manager-page";
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

import Shop from "./pages/shop/shop.tsx";
import Product from "./pages/product/product.tsx";

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
        path: "customers",
        element: <ProjectManagerCustomers />,
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
  // SHOP ROUTE
  {
    path: "/shop/*",
    element: <Shop />,
  },

  {
    path: "/product/*",
    element: <Product />
  }
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
