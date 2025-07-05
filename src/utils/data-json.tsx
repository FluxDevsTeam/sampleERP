import { nanoid } from "nanoid";
import {
  ArchiveIcon,
  FinancesIcon,
  HomeIcon,
  ProjectsIcon,
  StaffIcon,
  TransferIcon,
  OrdersIcon,
  RawMaterialIcon,LogoutIcon, SettingsIcon
} from "./SvgIcons";
import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMoneyBill,
  faPlusCircle,
  faReceipt,
  faTableCells,
  faMinusCircle,
  faPlusMinus,
  faFaceSmile,
  faScrewdriverWrench,
  faChevronDown,
  faChevronRight,
  faChartLine,
  faUsers,
  faBuilding,
  faShieldAlt,
  faStore,
  faWarehouse,
  faCog,
  faTachometerAlt,
  faBoxes,
  faClipboardList,
  faUserTie,
  faIndustry,
  faChartBar,
  faFileInvoiceDollar,
  faHandshake,
  faTools,
  faClipboardCheck,
  faUserCog,
  faChartPie,
  faBoxOpen,
  faTruck,
  faShoppingCart,
  faCashRegister,
  faPalette,
  faPaintBrush,
  faRuler,
  faCalculator,
  faFileAlt,
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export interface SidebarProps {
  id: string;
  text: string;
  href?: string;
  icon: ReactElement;
  isDropdown?: boolean;
  dropdownItems?: SidebarProps[];
}

export const sidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/ceo/dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Project Manager",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faUserTie} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/ceo/project-manager/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Products",
        href: "/ceo/project-manager/products",
        icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Projects",
        href: "/ceo/project-manager/projects",
        icon: <FontAwesomeIcon icon={faClipboardCheck} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Customers",
        href: "/ceo/project-manager/customers",
        icon: <FontAwesomeIcon icon={faUsers} className="text-lg" />,
      },
    ],
  },
  {
    id: nanoid(),
    text: "Factory Manager",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faIndustry} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/ceo/factory-manager/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Workers",
        href: "/ceo/factory-manager/workers",
        icon: <FontAwesomeIcon icon={faUsers} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Assets",
        href: "/ceo/factory-manager/assets",
        icon: <FontAwesomeIcon icon={faBuilding} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Customers",
        href: "/ceo/factory-manager/customers",
        icon: <FontAwesomeIcon icon={faHandshake} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Expenses",
        href: "/ceo/factory-manager/expenses",
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Projects",
        href: "/ceo/factory-manager/projects",
        icon: <FontAwesomeIcon icon={faClipboardCheck} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Products",
        href: "/ceo/factory-manager/products",
        icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
      },
    ],
  },
  {
    id: nanoid(),
    text: "Admin",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faShieldAlt} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/admin/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Assets",
        href: "/admin/assets",
        icon: <FontAwesomeIcon icon={faBuilding} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Expenses",
        href: "/admin/expenses",
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Paid",
        href: "/admin/paid",
        icon: <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Workers",
        href: "/admin/workers",
        icon: <FontAwesomeIcon icon={faUsers} className="text-lg" />,
      },
    ],
  },
  {
    id: nanoid(),
    text: "Accountant",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faCalculator} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/accountant/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Assets",
        href: "/admin/assets",
        icon: <FontAwesomeIcon icon={faBuilding} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Expenses",
        href: "/admin/expenses",
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Paid",
        href: "/admin/paid",
        icon: <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Workers",
        href: "/admin/workers",
        icon: <FontAwesomeIcon icon={faUsers} className="text-lg" />,
      },
    ],
  },
  {
    id: nanoid(),
    text: "Shop",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faStore} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/ceo/shop/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Inventory",
        href: "/ceo/shop/inventory",
        icon: <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Sold Items",
        href: "/ceo/shop/sold",
        icon: <FontAwesomeIcon icon={faCashRegister} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Add Stock",
        href: "/ceo/shop/stock",
        icon: <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />,
      },
    ],
  },
  {
    id: nanoid(),
    text: "Store",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faWarehouse} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/ceo/store/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Raw Materials",
        href: "/ceo/store/raw-materials",
        icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Removed Items",
        href: "/ceo/store/removed",
        icon: <FontAwesomeIcon icon={faMinusCircle} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Add Raw Material",
        href: "/ceo/store/record-rm-added",
        icon: <FontAwesomeIcon icon={faPlusMinus} className="text-lg" />,
      },
      {id: nanoid(),
        text: "Products",
        href: "/store-keeper/products",
        icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
        },
    ],
  },
  {
    id: nanoid(),
    text: "Settings",
    href: "/ceo/settings", 
    icon: <FontAwesomeIcon icon={faCog} className="text-lg" />,
  },
];

export const projectManagerSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/project-manager/dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Projects",
    href: "/project-manager/projects",
    icon: <FontAwesomeIcon icon={faClipboardCheck} className="text-lg" />,
  },
  {
    id: "2",
    text: "Product",
    href: "/project-manager/main",
    icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Customers",
    href: "/project-manager/customers",
    icon: <FontAwesomeIcon icon={faUsers} className="text-lg" />,
  },
  // {
  //   id: nanoid(),
  //   text: "Store",
  //   isDropdown: true,
  //   icon: <FontAwesomeIcon icon={faWarehouse} className="text-lg" />,
  //   dropdownItems: [
  //     {
  //       id: nanoid(),
  //       text: "Dashboard",
  //       href: "/project-manager/store/dashboard",
  //       icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  //     },
  //     {
  //       id: nanoid(),
  //       text: "Raw Materials",
  //       href: "/project-manager/store/raw-materials",
  //       icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
  //     },
  //     {
  //       id: nanoid(),
  //       text: "Removed Items",
  //       href: "/project-manager/store/removed",
  //       icon: <FontAwesomeIcon icon={faMinusCircle} className="text-lg" />,
  //     },
  //     {
  //       id: nanoid(),
  //       text: "Add Raw Material",
  //       href: "/project-manager/store/record-rm-added",
  //       icon: <FontAwesomeIcon icon={faPlusMinus} className="text-lg" />,
  //     },
  //   ],
  // },
  // {
  //   id: nanoid(),
  //   text: "Shop",
  //   isDropdown: true,
  //   icon: <FontAwesomeIcon icon={faStore} className="text-lg" />,
  //   dropdownItems: [
  //     {
  //       id: nanoid(),
  //       text: "Dashboard",
  //       href: "/project-manager/shop/dashboard",
  //       icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  //     },
  //     {
  //       id: nanoid(),
  //       text: "Inventory",
  //       href: "/project-manager/shop/inventory",
  //       icon: <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />,
  //     },
  //     {
  //       id: nanoid(),
  //       text: "Sold Items",
  //       href: "/project-manager/shop/sold",
  //       icon: <FontAwesomeIcon icon={faCashRegister} className="text-lg" />,
  //     },
  //     {
  //       id: nanoid(),
  //       text: "Add Stock",
  //       href: "/project-manager/shop/stock",
  //       icon: <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />,
  //     },
  //   ],
  // },
];

export const FactoryManagerSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/factory-manager/dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Workers",
    href: "/factory-manager/workers",
    icon: <FontAwesomeIcon icon={faUsers} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Assets",
    href: "/factory-manager/assets",
    icon: <FontAwesomeIcon icon={faBuilding} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Customers",
    href: "/factory-manager/customers",
    icon: <FontAwesomeIcon icon={faHandshake} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Expenses",
    href: "/factory-manager/expenses",
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Projects",
    href: "/factory-manager/projects",
    icon: <FontAwesomeIcon icon={faClipboardCheck} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Products",
    href: "/factory-manager/products",
    icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Store",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faWarehouse} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/factory-manager/store/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Raw Materials",
        href: "/factory-manager/store/raw-materials",
        icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Removed Items",
        href: "/factory-manager/store/removed",
        icon: <FontAwesomeIcon icon={faMinusCircle} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Add Raw Material",
        href: "/factory-manager/store/record-rm-added",
        icon: <FontAwesomeIcon icon={faPlusMinus} className="text-lg" />,
      },
    ],
  },
  {
    id: nanoid(),
    text: "Shop",
    isDropdown: true,
    icon: <FontAwesomeIcon icon={faStore} className="text-lg" />,
    dropdownItems: [
      {
        id: nanoid(),
        text: "Dashboard",
        href: "/factory-manager/shop/dashboard",
        icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Inventory",
        href: "/factory-manager/shop/inventory",
        icon: <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Sold Items",
        href: "/factory-manager/shop/sold",
        icon: <FontAwesomeIcon icon={faCashRegister} className="text-lg" />,
      },
      {
        id: nanoid(),
        text: "Add Stock",
        href: "/factory-manager/shop/stock",
        icon: <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />,
      },
    ],
  },
];

export const storeKeeperSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/store-keeper/dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Raw Materials",
    href: "/store-keeper/raw-materials",
    icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Removed Items",
    href: "/store-keeper/removed",
    icon: <FontAwesomeIcon icon={faMinusCircle} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Add Raw Material",
    href: "/store-keeper/record-rm-added",
    icon: <FontAwesomeIcon icon={faPlusMinus} className="text-lg" />,
  },
  {id: nanoid(),
    text: "Products",
    href: "/store-keeper/products",
    icon: <FontAwesomeIcon icon={faBoxes} className="text-lg" />,
    },
];

export const shopSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/shop/dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Inventory",
    href: "/shop/inventory",
    icon: <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Sold Items",
    href: "/shop/sold",
    icon: <FontAwesomeIcon icon={faCashRegister} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Add Stock",
    href: "/shop/stock",
    icon: <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />,
  },
];

export const adminSidebarLink: SidebarProps[] = [
  {
    id: nanoid(),
    text: "Dashboard",
    href: "/admin/dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Assets",
    href: "/admin/assets",
    icon: <FontAwesomeIcon icon={faBuilding} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Expenses",
    href: "/admin/expenses",
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Paid",
    href: "/admin/paid",
    icon: <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />,
  },
  {
    id: nanoid(),
    text: "Workers",
    href: "/admin/workers",
    icon: <FontAwesomeIcon icon={faUsers} className="text-lg" />,
  },
];

export function getSidebarForRole(role: string | null | undefined) {
  switch (role) {
    case 'ceo':
      return sidebarLink;
    case 'admin':
    case 'accountant':
      return adminSidebarLink;
    case 'project_manager':
      return projectManagerSidebarLink;
    case 'factory_manager':
      return FactoryManagerSidebarLink;
    case 'storekeeper':
      return storeKeeperSidebarLink;
    case 'shopkeeper':
      return shopSidebarLink;
    default:
      return [];
  }
}
