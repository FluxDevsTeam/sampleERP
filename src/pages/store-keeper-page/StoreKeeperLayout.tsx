import { Outlet } from "react-router-dom";
import GlobalLayout from "../../components/GlobalLayout";
import { getSidebarForRole } from "../../utils/data-json";

const StoreKeeperLayout = () => {
  const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  const sidebar = getSidebarForRole(role);
  return (
    <GlobalLayout data={sidebar}>
      <Outlet />
    </GlobalLayout>
  );
};

export default StoreKeeperLayout;
