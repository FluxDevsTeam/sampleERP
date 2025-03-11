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
    text: "projects",
    href: "/ceo/projects",
    icon: <ProjectsIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "customers",
    href: "/ceo/customers",
    icon: <TransferIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Workers",
    href: "/ceo/workers",
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Assets",
    href: "/ceo/asssets",
    icon: <StaffIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "shop",
    href: "/ceo/shop",
    icon: <ArchiveIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Products",
    href: "/ceo/products",
    icon: <StaffIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Expenses",
    href: "/ceo/expenses",
    icon: <ArchiveIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Overhead",
    href: "/ceo/overhead",
    icon: <ArchiveIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "Store",
    href: "/ceo/store",
    icon: <ArchiveIcon className="currentColor" />,
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
    href: "/project-manager/all-projects",
    icon: <ProjectsIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "products",
    href: "/project-manager/products",
    icon: <TransferIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "customers",
    href: "/project-manager/customers",
    icon: <TransferIcon className="currentColor" />,
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
    icon: <FinancesIcon className="currentColor" />,
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
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "expenses",
    href: "/factory-manager/expenses",
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "projects",
    href: "/factory-manager/projects",
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "products",
    href: "/factory-manager/products",
    icon: <FinancesIcon className="currentColor" />,
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
      href: "/admin/dashboard/assets",
      icon: <OrdersIcon className="currentColor" />,
    },
    {
      id: nanoid(),
      text: "expenses",
      href: "/admin/dashboard/expenses",
      icon: <RawMaterialIcon className="currentColor" />,
    },
    {
      id: nanoid(),
      text: "paid",
      href: "/admin/dashboard/paid",
      icon: <ArchiveIcon className="currentColor" />,
    },
    {
      id: nanoid(),
      text: "workers",
      href: "/admin/dashboard/workers",
      icon: <FinancesIcon className="currentColor" />,
    },
];
