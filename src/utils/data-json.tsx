import { nanoid } from "nanoid";
import {
  ArchiveIcon,
  FinancesIcon,
  HomeIcon,
  ProjectsIcon,
  StaffIcon,
  TransferIcon,
} from "./SvgIcons";
export const sidebarLink = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "all projects",
    href: "/dashboard/all-projects",
    icon: <ProjectsIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "customers",
    href: "/dashboard/customers",
    icon: <TransferIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "finances",
    href: "/dashboard/finances",
    icon: <FinancesIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "staffs",
    href: "/dashboard/staffs",
    icon: <StaffIcon className="currentColor" />,
  },
  {
    id: nanoid(),
    text: "archives",
    href: "/dashboard/archives",
    icon: <ArchiveIcon className="currentColor" />,
  },
];
