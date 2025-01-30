import { Outlet } from "react-router-dom";
import { projectManagerSidebarLink } from "../../utils/data-json";
import GlobalLayout from "../../components/GlobalLayout";

const SharedLayout = () => {
  return (
    <GlobalLayout data={projectManagerSidebarLink}>
      <Outlet />
    </GlobalLayout>
  );
};

export default SharedLayout;
