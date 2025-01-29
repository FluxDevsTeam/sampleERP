import { nanoid } from "nanoid";

import {
  ArchiveIcon,
  FinancesIcon,
  HomeIcon,
  ProjectsIcon,
  StaffIcon,
  TransferIcon,
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
];
