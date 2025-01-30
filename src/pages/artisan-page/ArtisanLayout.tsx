import { Outlet } from "react-router-dom";
import GlobalLayout from "../../components/GlobalLayout";
import { artisanSidebarLink } from "../../utils/data-json";
const ArtisanLayout = () => {
  return (
    <GlobalLayout data={artisanSidebarLink}>
      <Outlet />
    </GlobalLayout>
  );
};

export default ArtisanLayout;
