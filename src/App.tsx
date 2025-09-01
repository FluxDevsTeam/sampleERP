import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  CEODashboard,
  CEOProjects,
  CEOCustomers,
  CEOStore,
  CEOProducts,
  CEOShop,
  CEOOverhead,
  CEOSharedLayout,
} from "./pages/ceo";
import Settings from "./pages/ceo/settingss/settings.tsx";
import NotFoundPage from "./components/NotFound.tsx";

import {
  Workers,
  AdminDashboard,
  Expenses,
  AdminLayout,
  Assets,
  Paid,
} from "./pages/admin";
import AddAsset from "./pages/admin/assests/_pages/AddAsset";
import EditAsset from "./pages/admin/assests/_pages/EditAsset";
import AddExpense from "./pages/admin/expenses/_pages/AddExpense";
import EditExpense from "./pages/admin/expenses/_pages/EditExpense";

import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/landing/home";
import About from "./pages/landing/about";
import Contact from "./pages/landing/contact";
import Pricing from "./pages/landing/pricing";

import {
  FactoryManagerSharedLayout,
  FactoryManagerDashboard,
  FactoryManagerProducts,
} from "./pages/factory-manager-page";

import FactoryManagerCustomers from "./pages/factory-manager-page/customers/FactoryManagerCustomers.tsx";
import CustomerProfile from "./pages/factory-manager-page/customers/CustomerProfile.tsx";

import { ProjectManagerLayout } from "./pages/project-manager-page";
import ProjectManagerDashboard from "./pages/project-manager-page/dashboard/ProjectManagerDashboard";
import ProductsTable from "./pages/project-manager-page/product/ProductsTable";
import AddNewProductPage from "./pages/project-manager-page/product/Product Components/AddNewProduct";
import AddContractorPage from "./pages/project-manager-page/product/Product Components/AddContractorPage";
import AddWorkerPage from "./pages/project-manager-page/product/Product Components/AddWorkerPage";
import EditProduct from "./pages/project-manager-page/product/Product Components/EditProduct";
import AddQuotation from "./pages/project-manager-page/product/Product Components/AddQuotation";
import EditQuotation from "./pages/project-manager-page/product/Product Components/EditQuotation";
import ProductTaskPage from "./pages/project-manager-page/product/ProductTaskPage";

import { StoreKeeperLayout } from "./pages/store-keeper-page";
import StoreKeeperDashboard from "./pages/store-keeper-page/dashboard/StoreKeeperDashboard";
import AddRMCategory from "./pages/store-keeper-page/dashboard/Dashboard Components/AddRMCategory";
import RawMaterials from "./pages/store-keeper-page/raw-materials/RawMaterials";
import AddNewRawMaterial from "./pages/store-keeper-page/raw-materials/Raw Materials Component/AddNewRawMaterial";
import EditRawMaterial from "./pages/store-keeper-page/raw-materials/Raw Materials Component/EditRawMaterial";
import AddRawMaterialCategory from "./pages/store-keeper-page/raw-materials/Raw Materials Component/AddRawMaterialCategory";
import Removed from "./pages/store-keeper-page/removed/Removed";
import EditRemovedItem from "./pages/store-keeper-page/removed/Removed Components/EditRemovedItem";
import AddRemovedItem from "./pages/store-keeper-page/removed/Removed Components/AddRemovedItem";
import RecordRemoved from "./pages/store-keeper-page/record rm added/Record-Of-Added-RM-Quantity";
import AddToRM from "./pages/store-keeper-page/record rm added/record rm added components/Add-To-RM";

import { ShopSharedLayout } from "./pages/shop";
import ShopDashboard from "./pages/shop/dashboard/ShopDashboard";
import Inventory from "./pages/shop/inventory/Inventory";
import Sold from "./pages/shop/sold/Sold";
import Stock from "./pages/shop/stock/Stock";
import AddItemPage from "./pages/shop/inventory/Inventory Components/AddNewItemPage";
import AddCategoryPage from "./pages/shop/inventory/Inventory Components/AddNewCategory";
import EditItemPage from "./pages/shop/inventory/Inventory Components/EditItemPage";
import AddNewSoldItemPage from "./pages/shop/sold/Sold Components/AddNewSoldItemPage";
import EditSoldItemPage from "./pages/shop/sold/Sold Components/EditSoldItemPage";
import AddNewStockPage from "./pages/shop/stock/Stock Components/AddNewStock";
import EditStockItemPage from "./pages/shop/stock/Stock Components/EditStockItemPage";

import EditPayment from "./pages/admin/paid/_pages/EditPayment";
import AddPayment from "./pages/admin/paid/_pages/AddPayment";
import AddSalaryWorker from "./pages/admin/workers/_pages/_salaryWorkers/AddSalaryWorker";
import AddContractor from "./pages/admin/workers/_pages/_contractors/AddContractor";
import EditSalaryWorker from "./pages/admin/workers/_pages/_salaryWorkers/EditSalaryWorker";
import EditContractor from "./pages/admin/workers/_pages/_contractors/EditContractor";
import SalaryWorkerRecords from "./pages/admin/workers/_records/_salaryWorksRecords/SalaryWorkersecord";
import ContractorRecords from "./pages/admin/workers/_records/_contractorsRecords/ContractorRecords";
import WorkDetails from "./pages/admin/workers/_pages/WorkDetails";
import AddProject from "./pages/ceo/allProjects/_pages/AddProject";
import EditProject from "./pages/ceo/allProjects/_pages/EditProject";
import OtherProductionRecords from "./pages/ceo/allProjects/_pages/OtherProductionRecords";
import Income from "./pages/admin/income/Income";

import Shop from "./pages/shop/shop.tsx";
import Product from "./pages/product/product.tsx";
import EditRecordRemovedItem from "./pages/store-keeper-page/record rm added/record rm added components/EditRecordAddedItem.tsx";

import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import RootLayout from "./RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Use RootLayout as the root
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "pricing", element: <Pricing /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // CEO ROUTES
  {
    path: "/ceo",
    element: <CEOSharedLayout />,
    children: [
      {
        index: true,
        element: <CEODashboard />,
      },
      {
        path: "dashboard",
        element: <CEODashboard />,
      },
      {
        path: "income",
        element: <Income />,
      },
      // Project Manager routes
      {
        path: "project-manager/dashboard",
        element: <ProjectManagerDashboard />,
      },
      {
        path: "projects/:id/records",
        element: <OtherProductionRecords />,
      },
      {
        path: "project-manager/products",
        element: <ProductsTable />,
      },
      {
        path: "project-manager/customers",
        element: <FactoryManagerCustomers />,
      },
      {
        path: "project-manager/projects",
        element: <CEOProjects />,
      },
      // Factory Manager routes
      {
        path: "factory-manager/dashboard",
        element: <FactoryManagerDashboard />,
      },
      {
        path: "factory-manager/workers",
        element: <Workers />,
      },
      {
        path: "factory-manager/assets",
        element: <Assets />,
      },
      {
        path: "factory-manager/customers",
        element: <FactoryManagerCustomers />,
      },
      {
        path: "factory-manager/expenses",
        element: <Expenses />,
      },
      {
        path: "factory-manager/income",
        element: <Income />,
      },
      {
        path: "factory-manager/projects",
        element: <CEOProjects />,
      },
      {
        path: "factory-manager/projects/:id/records",
        element: <OtherProductionRecords />,
      },
      {
        path: "factory-manager/products",
        element: <ProductsTable />,
      },
      // Admin routes
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "admin/assets",
        element: <Assets />,
      },
      {
        path: "admin/expenses",
        element: <Expenses />,
      },
      {
        path: "admin/income",
        element: <Income />,
      },
      {
        path: "admin/paid",
        element: <Paid />,
      },
      {
        path: "admin/workers",
        element: <Workers />,
      },
      // Store routes
      {
        path: "store/dashboard",
        element: <StoreKeeperDashboard />,
      },
      {
        path: "store/raw-materials",
        element: <RawMaterials />,
      },
      {
        path: "store/removed",
        element: <Removed />,
      },
      {
        path: "store/record-rm-added",
        element: <RecordRemoved />,
      },
      // Shop routes
      {
        path: "shop/dashboard",
        element: <ShopDashboard />,
      },
      {
        path: "shop/inventory",
        element: <Inventory />,
      },
      {
        path: "shop/sold",
        element: <Sold />,
      },
      {
        path: "shop/stock",
        element: <Stock />,
      },
      // Settings
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

  // FACTORY MANAGER ROUTES
  {
    path: "/factory-manager",
    element: <FactoryManagerSharedLayout />,
    children: [
      {
        index: true,
        element: <FactoryManagerDashboard />,
      },
      {
        path: "dashboard",
        element: <FactoryManagerDashboard />,
      },
      {
        path: "projects",
        element: <CEOProjects />,
      },
      {
        path: "projects/:id/records",
        element: <OtherProductionRecords />,
      },
      {
        path: "customers",
        element: <FactoryManagerCustomers />,
      },
      {
        path: "customers/:id",
        element: <CustomerProfile />,
      },
      {
        path: "workers",
        element: <Workers />,
      },
      {
        path: "assets",
        element: <Assets />,
      },
      {
        path: "products",
        element: <ProductsTable />,
      },
      {
        path: "expenses",
        element: <Expenses />,
      },
      {
        path: "income",
        element: <Income />,
      },
      // Store routes
      {
        path: "store/dashboard",
        element: <StoreKeeperDashboard />,
      },
      {
        path: "store/raw-materials",
        element: <RawMaterials />,
      },
      {
        path: "store/removed",
        element: <Removed />,
      },
      {
        path: "store/record-rm-added",
        element: <RecordRemoved />,
      },
      // Shop routes
      {
        path: "shop/dashboard",
        element: <ShopDashboard />,
      },
      {
        path: "shop/inventory",
        element: <Inventory />,
      },
      {
        path: "shop/sold",
        element: <Sold />,
      },
      {
        path: "shop/stock",
        element: <Stock />,
      },
    ],
  },

  // PROJECT MANAGER ROUTES
  {
    path: "/project-manager",
    element: <ProjectManagerLayout />,
    children: [
      {
        index: true,
        element: <ProjectManagerDashboard />,
      },
      {
        path: "dashboard",
        element: <ProjectManagerDashboard />,
      },
      {
        path: "main",
        element: <ProductsTable />,
      },
      {
        path: "add-product",
        element: <AddNewProductPage />,
      },
      {
        path: "add-contractor/:id",
        element: <AddContractorPage />,
      },
      {
        path: "add-worker/:id",
        element: <AddWorkerPage />,
      },
      {
        path: "edit-product/:id",
        element: <EditProduct />,
      },
      {
        path: "add-quotation/:productId",
        element: <AddQuotation />,
      },
      {
        path: "edit-quotation/:productId/:quotationId",
        element: <EditQuotation />,
      },
      {
        path: "customers",
        element: <FactoryManagerCustomers />,
      },
      {
        path: "projects",
        element: <CEOProjects />,
      },
      {
        path: "projects/:id/records",
        element: <OtherProductionRecords />,
      },
      // Store routes
      {
        path: "store/dashboard",
        element: <StoreKeeperDashboard />,
      },
      {
        path: "store/raw-materials",
        element: <RawMaterials />,
      },
      {
        path: "store/removed",
        element: <Removed />,
      },
      {
        path: "store/record-rm-added",
        element: <RecordRemoved />,
      },
      // Shop routes
      {
        path: "shop/dashboard",
        element: <ShopDashboard />,
      },
      {
        path: "shop/inventory",
        element: <Inventory />,
      },
      {
        path: "shop/sold",
        element: <Sold />,
      },
      {
        path: "shop/stock",
        element: <Stock />,
      },
    ],
  },

  // STORE KEEPER ROUTES
  {
    path: "/store-keeper",
    element: <StoreKeeperLayout />,
    children: [
      {
        index: true,
        element: <StoreKeeperDashboard />,
      },
      {
        path: "dashboard",
        element: <StoreKeeperDashboard />,
      },
      {
        path: "add-raw-material-category",
        element: <AddRMCategory />,
      },
      {
        path: "raw-materials",
        element: <RawMaterials />,
      },
      {
        path: "raw-materials/add-category",
        element: <AddRawMaterialCategory />,
      },
      {
        path: "add-raw-material",
        element: <AddNewRawMaterial />,
      },
      {
        path: "edit-raw-material/:id",
        element: <EditRawMaterial />,
      },
      {
        path: "removed",
        element: <Removed />,
      },
      {
        path: "add-removed",
        element: <AddRemovedItem />,
      },
      {
        path: "edit-removed/:id",
        element: <EditRemovedItem />,
      },
      {
        path: "record-rm-added",
        element: <RecordRemoved />,
      },
      {
        path: "edit-record-removed/:id",
        element: <EditRecordRemovedItem />,
      },
      {
        path: "add-record-removed",
        element: <AddToRM />,
      },
      {
        path: "products",
        element: <ProductsTable />,
      },
      {
        path: "projects",
        element: <CEOProjects />,
      },
      {
        path: "projects/:id/records",
        element: <OtherProductionRecords />,
      },
    ],
  },

  // SHOP ROUTES
  {
    path: "/shop",
    element: <ShopSharedLayout />,
    children: [
      {
        index: true,
        element: <ShopDashboard />,
      },
      {
        path: "dashboard",
        element: <ShopDashboard />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "add-new-item",
        element: <AddItemPage />,
      },
      {
        path: "add-new-category",
        element: <AddCategoryPage />,
      },
      {
        path: "edit-item/:id",
        element: <EditItemPage />,
      },
      {
        path: "sold",
        element: <Sold />,
      },
      {
        path: "add-new-sold-item",
        element: <AddNewSoldItemPage />,
      },
      {
        path: "edit-sold-item/:id",
        element: <EditSoldItemPage />,
      },
      {
        path: "stock",
        element: <Stock />,
      },
      {
        path: "add-new-stock",
        element: <AddNewStockPage />,
      },
      {
        path: "edit-stock-item/:id",
        element: <EditStockItemPage />,
      },
    ],
  },

  // ADMIN ROUTES
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "dashboard",
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
        path: "income",
        element: <Income />,
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
        element: <ContractorRecords />,
      },
      {
        path: ":workerType/:id/work",
        element: <WorkDetails />,
      },
      {
        path: "projects",
        element: <CEOProjects />,
      },
      {
        path: "projects/:id/records",
        element: <OtherProductionRecords />,
      },
      // Store routes
      {
        path: "store/dashboard",
        element: <StoreKeeperDashboard />,
      },
      {
        path: "store/raw-materials",
        element: <RawMaterials />,
      },
      {
        path: "store/removed",
        element: <Removed />,
      },
      {
        path: "store/record-rm-added",
        element: <RecordRemoved />,
      },
      // Shop routes
      {
        path: "shop/dashboard",
        element: <ShopDashboard />,
      },
      {
        path: "shop/inventory",
        element: <Inventory />,
      },
      {
        path: "shop/sold",
        element: <Sold />,
      },
      {
        path: "shop/stock",
        element: <Stock />,
      },
    ],
  },

  // PUBLIC SHOP ROUTE
  {
    path: "/shop/*",
    element: <Shop />,
  },

  // PUBLIC PRODUCT ROUTE
  {
    path: "/product/*",
    element: <Product />,
  },

  // ACCOUNTANT ROUTES
  {
    path: "/accountant",
    element: <AccountantDashboard />,
    children: [
      {
        index: true,
        element: <AccountantDashboard />,
      },
      {
        path: "dashboard",
        element: <AccountantDashboard />,
      },
      {
        path: "income",
        element: <Income />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;