import { Outlet } from "react-router-dom";
import GlobalLayout from "../../components/GlobalLayout";
import { storeKeeperSidebarLink } from "../../utils/data-json";

const StoreKeeperLayout = () => {
  return (
    <GlobalLayout data={storeKeeperSidebarLink}>
      <Outlet />
    </GlobalLayout>
  );
};

export default StoreKeeperLayout;
