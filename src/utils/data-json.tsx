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
    text: "all projects",
    href: "/ceo/dashboard/all-projects",
    icon: <ProjectsIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "customers",
    href: "/ceo/dashboard/customers",
    icon: <TransferIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "finances",
    href: "/ceo/dashboard/finances",
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "staffs",
    href: "/ceo/dashboard/staffs",
    icon: <StaffIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "archives",
    href: "/ceo/dashboard/archives",
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
    text: "all projects",
    href: "/project-manager/dashboard/all-projects",
    icon: <ProjectsIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "products",
    href: "/project-manager/dashboard/products",
    icon: <TransferIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "customers",
    href: "/project-manager/dashboard/customers",
    icon: <TransferIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "finances",
    href: "/project-manager/dashboard/finances",
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "staffs",
    href: "/project-manager/dashboard/staffs",
    icon: <StaffIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "archives",
    href: "/project-manager/dashboard/archives",
    icon: <ArchiveIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "man",
    href: "/project-manager/dashboard/archives",
    icon: <ArchiveIcon className="currentColor" />,
  },
];
export const artisanSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/artisan/dashboard",
    icon: <HomeIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "payment",
    href: "/artisan/dashboard/payment",
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
  {
    id: nanoid(),
    text: "orders",
    href: "/store-keeper/dashboard/orders",
    icon: <OrdersIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "raw materials",
    href: "/store-keeper/dashboard/raw-materials",
    icon: <RawMaterialIcon className="currentColor" />,
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
      text: "contractors",
      href: "/admin/dashboard/contractors",
      icon: <StaffIcon className="currentColor" />,
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
