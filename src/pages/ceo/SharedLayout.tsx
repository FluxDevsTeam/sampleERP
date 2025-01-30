import { Outlet } from "react-router-dom";
import { sidebarLink } from "../../utils/data-json";
import GlobalLayout from "../../components/GlobalLayout";

const SharedLayout = () => {
  return (
    <GlobalLayout data={sidebarLink}>
      <Outlet />
    </GlobalLayout>
  );
};

export default SharedLayout;
