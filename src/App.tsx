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
import Logout from "./pages/ceo/logout/logout";
import Staffs from "./pages/ceo/staffs/staffs";


const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Landing />,
  // },
  // DASHBOARD ROUTE
  {
    path: "/dashboard",
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
      {
        path: "logout",
        element: <Logout />,
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
