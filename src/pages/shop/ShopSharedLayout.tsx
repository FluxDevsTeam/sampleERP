import { Outlet } from "react-router-dom";
import GlobalLayout from "../../components/GlobalLayout";
import { shopSidebarLink } from "../../utils/data-json";

const StoreKeeperLayout = () => {
  return (
    <GlobalLayout data={shopSidebarLink}>
      <Outlet />
    </GlobalLayout>
  );
};

export default StoreKeeperLayout;
