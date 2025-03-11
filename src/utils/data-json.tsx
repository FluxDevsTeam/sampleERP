import { nanoid } from "nanoid";
import {
  ArchiveIcon,
  FinancesIcon,
  HomeIcon,
  ProjectsIcon,
  StaffIcon,
  TransferIcon,
  OrdersIcon,
  RawMaterialIcon,
} from "./SvgIcons";
import { ReactElement } from "react";

export interface SidebarProps {
  id: string;
  text: string;
  href: string;
  icon: ReactElement;
}

export const sidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/ceo/dashboard",
    icon: <HomeIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Projects",
    href: "/ceo/projects",  // Removed "dashboard"
    icon: <ProjectsIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Customers",
    href: "/ceo/customers",
    icon: <TransferIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Workers",
    href: "/ceo/workers",
    icon: <ArchiveIcon  className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Assets",
    href: "/ceo/assets",  // Fixed "asssets" typo and removed "dashboard"
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Products",
    href: "/ceo/products",
    icon: <StaffIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Store",
    href: "/ceo/store",
    icon: <TransferIcon  className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Expenses",
    href: "/ceo/expenses",
    icon: <OrdersIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Overhead",
    href: "/ceo/overhead",  // Removed "dashboard"
    icon: <RawMaterialIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Shop",
    href: "/ceo/shop",  // Removed "dashboard"
    icon: <FinancesIcon className="currentColor" />,
  },
];


export const projectManagerSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/project-manager/dashboard",
    icon: <HomeIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "projects",
    href: "/project-manager/projects",
    icon: <ProjectsIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "products",
    href: "/project-manager/products",
    icon: <OrdersIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "customers",
    href: "/project-manager/customers",
    icon: <ArchiveIcon className="currentColor" />,
  },
  

];
export const FactoryManagerSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/factory-manager/dashboard",
    icon: <HomeIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "workers",
    href: "/factory-manager/workers",
    icon: <StaffIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "assets",
    href: "/factory-manager/assets",
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "customers",
    href: "/factory-manager/customers",
    icon: <RawMaterialIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "expenses",
    href: "/factory-manager/expenses",
    icon: <OrdersIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "projects",
    href: "/factory-manager/projects",
    icon: <ArchiveIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "products",
    href: "/factory-manager/products",
    icon: <ProjectsIcon className="currentColor" />,
  },
];

export const storeKeeperSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/store-keeper/dashboard",
    icon: <HomeIcon className="currentColor" />,
  },
  
];

export const shopSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/shop/dashboard",
    icon: <HomeIcon className="currentColor" />,
  },
  
];
 
  export const adminSidebarLink: SidebarProps[] = [
    {
      id: nanoid(),
      text: "Dashboard",
      href: "/admin/dashboard",
      icon: <HomeIcon className="currentColor" />,
    },
    {
      id: nanoid(),
      text: "assets",
      href: "/admin/assets",
      icon: <OrdersIcon className="currentColor" />,
    },
    {
      id: nanoid(),
      text: "expenses",
      href: "/admin/expenses",
      icon: <RawMaterialIcon className="currentColor" />,
    },
    {
      id: nanoid(),
      text: "paid",
      href: "/admin/paid",
      icon: <ArchiveIcon className="currentColor" />,
    },
    {
      id: nanoid(),
      text: "workers",
      href: "/admin/workers",
      icon: <FinancesIcon className="currentColor" />,
    },
];
