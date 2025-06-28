import { Outlet } from "react-router-dom";
import { getSidebarForRole } from "../../utils/data-json";
import GlobalLayout from "../../components/GlobalLayout";

const AdminLayout = () => {
  const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  const sidebar = getSidebarForRole(role);
  return (
    <GlobalLayout data={sidebar}>
      <Outlet />
    </GlobalLayout>
  );
};

export default AdminLayout;
