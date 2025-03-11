import { Outlet } from "react-router-dom";
import { FactoryManagerSidebarLink} from "../../utils/data-json";
import GlobalLayout from "../../components/GlobalLayout";

const CEOSharedLayout = () => {
  return (
    <GlobalLayout data={FactoryManagerSidebarLink}>
      <Outlet />
    </GlobalLayout>
  );
};

export default CEOSharedLayout;
