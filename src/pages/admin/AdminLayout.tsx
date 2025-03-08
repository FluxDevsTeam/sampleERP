import { Outlet } from "react-router-dom";
import {adminSidebarLink } from "../../utils/data-json";
import GlobalLayout from "../../components/GlobalLayout";

const AdminLayout = () => {
  return (
    <GlobalLayout data={adminSidebarLink}>
      <Outlet />
    </GlobalLayout>
  );
};

export default AdminLayout;
