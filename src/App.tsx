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
import ActiveProjects from "./pages/ceo/allProjects/projectComponents/ActiveProjects";
import CancelledProjects from "./pages/ceo/allProjects/projectComponents/CancelledProjects";
import CompletedProjects from "./pages/ceo/allProjects/projectComponents/CompletedProjects";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActivePage from "./pages/ceo/allProjects/projectComponents/ActivePage";
import Product from "./pages/ceo/allProjects/projectComponents/Product";

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
        path: "/dashboard/active-projects",
        element: <ActiveProjects />,
      },
      {
        path: "/dashboard/cancelled-projects",
        element: <CancelledProjects />,
      },
      {
        path: "/dashboard/completed-projects",
        element: <CompletedProjects />,
      },
      {
        path: "/dashboard/active",
        element: <ActivePage />,
      },
      {
        path: "/dashboard/product",
        element: <Product />,
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
