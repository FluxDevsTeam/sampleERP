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
} from "./pages/project-manager";

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
